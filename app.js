// Require packages and set the port
const express = require('express');
const port = 3002;
const bodyParser = require('body-parser');
var cors = require('cors');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
const fs = require('fs');
var Data;

fs.readFile('data.json', 'utf8', function (err, data) {
    if (err) throw err;
    Data = JSON.parse(data);
});
// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(cors())

app.get('/', (request, response) => {
    response.send(JSON.stringify(Data));
});

app.get('/:age', (request, response) => {

    console.log(request.params.age);
    var result = Data.filter(item => `:age=${item.age}` == request.params.age);
    console.log(result);

    response.send(JSON.stringify(result));
});

app.post("/add", urlencodedParser, (request, response) => {
    if(!request.body) return response.sendStatus(400);

    var newItem = {
        id: Data[Data.length - 1].id + 1,
        name: request.body.name,
        age: request.body.age,
        email: request.body.email
    }
    console.log(newItem);
    Data.push(newItem);
    fs.writeFile('data.json', JSON.stringify(Data, null, 2), function(error){
        if(error) throw error; // если возникла ошибка
                 
        console.log("Запись файла завершена. Содержимое файла:");
        let data = fs.readFileSync("data.json", "utf8");
        console.log(data);  // выводим считанные данные
    });

    response.send(`Successfully added!`);
});

app.put("/change", urlencodedParser, (request, response) => {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);

    var find = Data.find(item => item.id == request.body.id);

    find.name = request.body.name;
    find.age = request.body.age;
    find.email = request.body.email;

    fs.writeFile('data.json', JSON.stringify(Data, null, 2), function(error){
        if(error) throw error; // если возникла ошибка
                 
        console.log("Запись файла завершена. Содержимое файла:");
        let data = fs.readFileSync("data.json", "utf8");
        console.log(data);  // выводим считанные данные
    });

    response.send(`Successfully added!`);
});

app.delete("/delete", urlencodedParser, (request, response) => {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);

    let users = [];
    for(var i = 0; i < request.body.id.length; ++i){
        users.push(Data.find(item => item.id == request.body.id[i]));
    }

    console.log("Delete:" + JSON.stringify(users, null, 2));
    if(users)
    {
        for(var i = 0; i < users.length; ++i)
            if(users[i])
                Data.splice(Data.indexOf(users[i]), 1);

        fs.writeFile('data.json', JSON.stringify(Data, null, 2), function(error){
            if(error) throw error; // если возникла ошибка
                 
            console.log("Запись файла завершена. Содержимое файла:");
            let data = fs.readFileSync("data.json", "utf8");
            console.log(data);  // выводим считанные данные
        });

        response.send(`Successfully deleted!`);
    } else response.send(`Not Found!`);
});

// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
