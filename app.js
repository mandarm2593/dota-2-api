const express = require('express')
const bodyParser = require('body-parser')
const graphQLHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

app.use(bodyParser.json())

app.use('/graphql', graphQLHttp({
    schema: buildSchema(`
        type RootQuery {
            heroes: [String]!
        }
    
        schema {
            query: RootQuery
        }
    `),
    rootValue:{
        heroes: () => {
            return ['Anti Mage', 'Storm Spirit']
        }
    },
    graphiql: true
}))

app.get('/',(req,res) =>{
    res.send('Hello World')
})

app.listen(5000)











