//auth: notDuckk


const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
path = require('path')
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.json())
const cors= require("cors")
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))
const PORT = 3000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'prod.db'
  });


const favPairs = sequelize.define('favPairs', {
    baseCurr: {
        type: Sequelize.STRING,
        allowNull: false
    },
    targCurr:  {
        type: Sequelize.STRING,
        allowNull: false
    }
},{tableName:'favPairs',
    timestamps:false,
    freezeTableName: true,

})

// async function to find all fav pairs in db
async function findFavPairs() {
    let pairs = await favPairs.findAll();
    console.log(`All pairs:`, JSON.stringify(pairs,null,2))
    return pairs
}

// get req to get the fav pairs
app.get('/favs', async(req,res) => {
    const data = await findFavPairs();
    res.status(200).json(data)
})

// post req to post the fav pairs
app.post('/favs', async(req,res )=> {
    try {
        const {baseCurr,targCurr} =req.body;
        let pairs = await favPairs.create({baseCurr,targCurr});
        console.log('item created:', pairs.toJSON());
        res.status(201).json(pairs);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.error('Error creating pair', error);
    }

})


// Init server and db
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.sync();
    console.log('Database sync complete.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// initializing my express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})



