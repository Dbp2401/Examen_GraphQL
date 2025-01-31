import { Collection, ObjectId } from "mongodb";
import { APIPhone, RestaurantModel, APITemp, APIGeo, APITime } from "./types.ts";
import { GraphQLError } from "graphql";

type Context = {
    RestaurantCollection:Collection<RestaurantModel>
}

export const resolvers = {

    Query: {
        default : ():string =>{
            return "Hola Mundo"
        },
        getRestaurant:async(_:unknown,args:{id:string},ctx:Context):Promise<RestaurantModel|null>=>{
            if(!args)throw new GraphQLError("Faltan argumentos")
            return await ctx.RestaurantCollection.findOne({_id:new ObjectId(args.id)})
        },
        getRestaurants:async(_:unknown,__:unknown,ctx:Context):Promise<RestaurantModel[]>=>{
            return await ctx.RestaurantCollection.find().toArray()//falta la parte de buscar el nombre
        }
    },
    Mutation:{
        addRestaurant:async(_:unknown,args:{name:string,location:string,city:string,phone:string},ctx:Context):Promise<RestaurantModel>=>{
            const {name,location,city,phone}=args
            if(!name||!location||!city||!phone)throw new GraphQLError("Faltan parametros")
            const ninjaApiKey = Deno.env.get("apiNinjaKey");
            if (!ninjaApiKey) {
             throw new Error("La variable de entorno 'apiNinjaKey' no está configurada");
            }
            const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`
            const data = await fetch(url,
                {
                    headers: {
                        'X-Api-Key': ninjaApiKey
                      }
                }
            )
            if(data.status!==200)throw new GraphQLError("Api Ninja Error")
            const response: APIPhone = await data.json();
            if(!response.is_valid)throw new GraphQLError("Telefono en formato incorrecto")
            const {insertedId} = await ctx.RestaurantCollection.insertOne({name,location,city,phone})
            return {
                _id:insertedId,
                name,
                location,
                city,
                phone
            }
        },
        deleteRestaurant:async(_:unknown,args:{id:string},ctx:Context):Promise<boolean>=>{
            const {id}=args
            if(!id)throw new GraphQLError("Falta la id del restaurante")
            const {deletedCount} = await ctx.RestaurantCollection.deleteOne({_id:new ObjectId(id)})
            return deletedCount === 1
        }
    },
    Restaurant:{
        id:(parent:RestaurantModel):string=>{
            return parent._id!.toString();
        },
        temp:async(parent:RestaurantModel):Promise<string>=>{
            if(!parent.city)throw new GraphQLError("No hay ciudad")
            const city = parent.city
            const ninjaApiKey = Deno.env.get("apiNinjaKey");
            if (!ninjaApiKey) {
              throw new Error("La variable de entorno 'apiNinjaKey' no está configurada");
            }
            const urlGeo = `https://api.api-ninjas.com/v1/city?name=${city}`
            const dataGeo = await fetch(urlGeo,
                {
                    headers: {
                        'X-Api-Key': ninjaApiKey
                      }
                }
            )
            if(dataGeo.status!==200)throw new GraphQLError("Api Ninja Error")
            const responseGeo : APIGeo = await dataGeo.json();
            const latitude = responseGeo.latitude
            const longitude = responseGeo.longitude
            console.log(latitude+"\n"+longitude)



            const urlTemp = `https://api.api-ninjas.com/v1/weather?lat=51.5072&lon=-0.1275`//TODO Porque la api de la latencia y lkongitud no me iba
            const dataTemp = await fetch(urlTemp,
                {
                    headers: {
                        'X-Api-Key': ninjaApiKey
                      }
                }
            )

            if(dataTemp.status!==200)throw new GraphQLError("Api Ninja Error")
            const responseTemp: APITemp = await dataTemp.json()
            return responseTemp.temp + "ºC";
        },
        time:async(parent:RestaurantModel):Promise<string>=>{
            if(!parent.city)throw new GraphQLError("No hay ciudad")
            const city = parent.city
            const ninjaApiKey = Deno.env.get("apiNinjaKey");
            if (!ninjaApiKey) {
              throw new Error("La variable de entorno 'apiNinjaKey' no está configurada");
            }

            const urlGeo = `https://api.api-ninjas.com/v1/city?name=${city}`
            const dataGeo = await fetch(urlGeo,
                {
                    headers: {
                        'X-Api-Key': ninjaApiKey
                      }
                }
            )
            if(dataGeo.status!==200)throw new GraphQLError("Api Ninja Error")
            const responseGeo : APIGeo = await dataGeo.json();
            console.log(responseGeo)
            const latitude = responseGeo.latitude
            const longitude = responseGeo.longitude
            console.log(latitude+"\n"+longitude)

            const url = `https://api.api-ninjas.com/v1/worldtime?lat=51.5072&lon=-0.1275`//TODO Porque la api de la latencia y lkongitud no me iba
            const data = await fetch(url,
                {
                    headers: {
                        'X-Api-Key': ninjaApiKey
                      }
                }
            )
            //console.log(await data.json())para debugear
            if(data.status!==200)throw new GraphQLError("Api Ninja Error")
            const response: APITime = await data.json()
            return response.hour +":" +response.minute;
        }
    }

}
