import express from 'express';
import AWS from "aws-sdk";
import { v4 as generateId } from 'uuid';

const router = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('This is my response lol')
});

/* GET users listing. */
router.get('/recipes', async function(req, res, next) {
  await getAllFromDb(req, res);
});

router.get('/recipe/:id', async (req, res) => {
  await fetchRecipeById(req, res);
})

router.post('/recipe', async (req, res) => {
  await writeToDb(req, res);
});

const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });
const tableName = 'recipe-book';

const fetchRecipeById = async (req, res) => {
  const recipeId = req.params.id;
  await dbClient.get({ TableName: tableName, Key: { id: recipeId } }, (err, data) => {
    if (err) console.error(err);
    else {
      console.log(data.Item);
      res.status(200).send(data.Item)
    }
  })
}

const getAllFromDb = async (req, res) => {

  await dbClient.scan({ TableName: tableName}, (err, data) => {
    let items = []
    if (err) console.log(err);
    else {
      console.log(data);
      for (let i =0; i<data.Count; i++){
        items.push(data.Items[i]);
      }
    }
    res.send(items);
  })
}

const writeToDb = (req, res) => {
  const { name, ingredients, author, authorEmail, method, servingSize } = req.body;
  dbClient
      .put({
        Item: {
          id: generateId(),
          name,
          author,
          authorEmail,
          ingredients,
          createdOn: new Date().toISOString(),
          method,
          servingSize
        },
        TableName: tableName,
      })
      .promise()
      .then(data => {
        console.log(data);
        res.status(201).send( 'sent your data g')
      })
      .catch(err => {
        console.error(err);
        res.status(400).send('nah check your body is in json ennit')
      })
}

export default router;
