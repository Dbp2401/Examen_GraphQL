export const schema = `#graphql
    type Restaurant{
        id:ID!
        name:String!
        location:String!
        city:String!
        phone:String!
        temp:String!
        time:String!
    }
    type Query{
        default : String!
        getRestaurant(id:ID!):Restaurant
        getRestaurants:[Restaurant!]!
    }
    type Mutation{
        addRestaurant(name:String!,location:String!,city:String!,phone:String!):Restaurant!
        deleteRestaurant(id:ID!):Boolean!
    }

`;