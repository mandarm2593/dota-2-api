const express = require('express')
const bodyParser = require('body-parser')
const graphQLHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())

app.use('/graphql', graphQLHttp({
    schema: buildSchema(`
        type Hero {
        id: Int!
        name: String!
        primaryAttribute: String!
        attackType: String!
        roles:[String!]!
        legs:Int!
        }
        
        type RootQuery {
            heroes: [Hero!]!
            hero(id:Int!): Hero!
        }
    
        schema {
            query: RootQuery
        }
    `),
    rootValue:{
        hero:(args)=>{
            return axios.get('https://api.opendota.com/api/heroes').then((response)=>{
                const hero =response.data.find((heroInfo)=>{
                    return heroInfo.id===args.id
                })

                return {
                    id:hero.id,
                    name:hero.localized_name,
                    primaryAttribute: hero.primary_attr,
                    attackType: hero.attack_type,
                    roles: hero.roles,
                    legs: hero.legs
                }

            })
        },
        heroes: () => {
            return axios.get('https://api.opendota.com/api/heroes').then((response)=>{
                return response.data.map((heroInfo)=>{
                    return {
                        id:heroInfo.id,
                        name:heroInfo.localized_name,
                        primaryAttribute: heroInfo.primary_attr,
                        attackType: heroInfo.attack_type,
                        roles: heroInfo.roles,
                        legs: heroInfo.legs
                    }
                })

            })
        }
    },
    graphiql: true
}))

app.get('/',(req,res) =>{
    res.send('Hello World')
})

app.listen(5000)











