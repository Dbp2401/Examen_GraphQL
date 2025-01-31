import { OptionalId } from "mongodb";


export type RestaurantModel = OptionalId<{
    name:string,
    location:string,
    city:string,
    phone:string;
}>

export type Restaurant = {
    id:string,
    name:string,
    location:string,
    city:string,
    phone:string,
    temp:string,
}

export type APIPhone = {
    is_valid:boolean,
    country:string,
    timezones:string[],
}

export type APITemp = {
    temp:string
}

export type APIGeo = {
    latitude:number,
    longitude:number,
}

export type APITime = {
    hour:string
    minute:string
}