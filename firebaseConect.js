const admin = require("firebase-admin");
const express = require("express");

const app = express();

const credentials = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

// Rotas CRUD aqui...
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Adicionando ao banco de dados...
app.post('/create',async (req,res) => {
    try {
        const id = req.body.nomeCientifico;
        const userJson = {
            nomeCientifico: req.body.nomeCientifico,
            nome: req.body.nome,
            tipo: req.body.tipo,
            descricao: req.body.descricao,
            imagem: req.body.imagem
        };
        const response = await db.collection("Fauna").doc(id).set(userJson);
        res.send(response);
    } catch(e) {
        res.send(e);
    }
})

// Listando todo o banco de dados...
app.get('/read/all', async (req, res) => {
    try{
        const usersRef = db.collection("Fauna");
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch(e){
        res.send(e);
    }
})

// Listando uma unica coisa do banco de dados...
app.get('/read/:id', async (req,res) => {
    try{
        const userRef = db.collection("Fauna").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    } catch(e){
        res.send(e);
    }
})

// Atualizando o banco de dados...
app.post('/update/:id', async(req,res) => {
    try {
        const id = req.params.id;
        const userUpdate = {
            nomeCientifico: req.body.nomeCientifico,
            nome: req.body.nome,
            tipo: req.body.tipo,
            descricao: req.body.descricao,
            imagem: req.body.imagem
        };

        const response = await db.collection("Fauna").doc(id).update(userUpdate);
        res.send(response);

    } catch(e){
        res.send(e)
    }
})

// Deletando por id passado no banco de dados...
app.delete('/delete/:id', async (req, res) => {
    try {
        const response = await db.collection("Fauna").doc(req.params.id).delete();
        res.send(response);
    }catch(e){
        res.send(e);
    }
})
