const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const nunjucks = require("nunjucks");
const path = require("path");
const { send } = require("process");
const templatesDir = path.join(__dirname, "views");
//const serverless = require("serverless-http");
app.use(cors());
app.use(express.text());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req,res,next)=>{
   console.log(`${req.method}:${req.url}`);
   next();
})
nunjucks.configure(templatesDir, {
    autoescape: true,
    express: app,
    watch: true,
});


app.get("/wake",(req,res)=>{
   res.sendStatus(200)
})
//escreve o arquivo template njk baseado nos inputs do forms
app.post("/MakeHTML", (req, res) => {
    const content = req.body.componente;
    const footer = require(path.join(__dirname, "footer.js"));

    //aqui eu escrevo a primeira parte do HTML, e pego o input do HEX da cor do background
    const escreveHTMLbody1 = () => {
        let bgcolor = "";
        if (req.body.background) {
            bgcolor = req.body.background;
        } else {
            bgcolor = "#f6f6f6";
        }
      
        fs.writeFileSync(
            path.join(__dirname, "views", "template.njk"),
            `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1">\n<title>Document</title>\n<style>\nbody{margin:0; padding:0}\nimg{margin:0; padding:0; }\na[href^=tel]{ color:#666666; text-decoration:none;}\na[href^=date]{ color:#666666; text-decoration:none;}\nhr {margin:0 !important}\ndiv, p, a, li, td {-webkit-text-size-adjust:none;}\n.inlineblock>tbody,\n.inlineblock>tbody>tr,\n.inlineblock>tbody>tr>td {display: block; width: 100%}\n@media only screen and (max-width: 600px) {\nimgmobile{max-width: 70%}\n}\n</style>\n</head>\n<body>\n<div style="margin:0; padding:0;" bgcolor="#ffffff">\n<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="table-layout: fixed;" bgcolor="#F6F6F6"><tr><td align="center" valign="top">\n<!--[if mso]><table width="650" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" valign="top"><![endif]-->\n<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:650px" bgcolor="${bgcolor}">`
        );
    };
    //aqui eu pego o nome dos componentes e coloco no corpo do arquivo template.njk 
    const escreveContent = () => {
        for (let i = 0; i < content.length; i++) {
            const element = content[i];
            fs.appendFileSync(
                path.join(__dirname, "views", "template.njk"),
                `\n{% include "./${element}.njk" %}`
            );
        }
    };

    //aqui eu escrevo a ultima parte do html lá no arquivo template.njk
    const criaTemplate = () => {
        escreveHTMLbody1();
        escreveContent();
        fs.appendFileSync(
            path.join(__dirname, "views", "template.njk"),
            footer.HTMLbody2
        );
    };


    criaTemplate();
    console.log('terminou de escrever .njk');
    res.redirect("https://emailmaker-server.onrender.com/download");
});

//essa rota aqui compila o arquivo .njk num arquivo .html e disponibiliza download
app.get("/download", (req, res) => {
    var html = nunjucks.render("template.njk");
    fs.writeFileSync(path.join(__dirname, "output.html"), html);
    console.log('renderizou html');
    res.download(
        path.join(__dirname, "output.html"),
        "template.html",
        (err) => {
            if (err) {
                console.log(err);
            } else {
                fs.unlinkSync(path.join(__dirname, "output.html"));
            }
        }
    );
    console.log('disponibilizou download');
});

//escreve o arquivo template njk baseado nos inputs do forms e joga pro preview
app.post("/MakePreview", (req, res) => {
   const content = req.body.componente;
   const footer = require(path.join(__dirname, "footer.js"));

   const escreveHTMLbody1 = () => {
       let bgcolor = "";
       if (req.body.background) {
           bgcolor = req.body.background;
       } else {
           bgcolor = "#f6f6f6";
       }
       fs.writeFileSync(
           path.join(__dirname, "views", "template.njk"),
           `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1">\n<title>Amigão</title>\n<style>\nbody{margin:0; padding:0}\nimg{margin:0; padding:0; }\na[href^=tel]{ color:#666666; text-decoration:none;}\na[href^=date]{ color:#666666; text-decoration:none;}\nhr {margin:0 !important}\ndiv, p, a, li, td {-webkit-text-size-adjust:none;}\n.inlineblock>tbody,\n.inlineblock>tbody>tr,\n.inlineblock>tbody>tr>td {display: block; width: 100%}\n@media only screen and (max-width: 600px) {\nimgmobile{max-width: 70%}\n}\n</style>\n</head>\n<body>\n<div style="margin:0; padding:0;" bgcolor="#ffffff">\n<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="table-layout: fixed;" bgcolor="#F6F6F6"><tr><td align="center" valign="top">\n<!--[if mso]><table width="650" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" valign="top"><![endif]-->\n<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:650px" bgcolor="${bgcolor}">`
       );
   };

   const escreveContent = () => {
       for (let i = 0; i < content.length; i++) {
           const element = content[i];
           fs.appendFileSync(
               path.join(__dirname, "views", "template.njk"),
               `\n{% include "./${element}.njk" %}`
           );
       }
   };

   const criaTemplate = () => {
       escreveHTMLbody1();
       escreveContent();
       fs.appendFileSync(
           path.join(__dirname, "views", "template.njk"),
           footer.HTMLbody2
       );
   };

   criaTemplate();
   console.log('terminou de escrever .njk');
   res.redirect("https://emailmaker-server.onrender.com/preview");
});

//compila o HTML e disponibiliza o preview
app.get("/preview", (req, res) => {
   var html = nunjucks.render("template.njk");
   fs.writeFileSync(path.join(__dirname, "output.html"), html);
   console.log('renderizou html e liberou preview');
   res.sendFile(
       path.join(__dirname, "output.html"),
       "template.html",
       (err) => {
           if (err) {
               console.log(err);
           } else {
               fs.unlinkSync(path.join(__dirname, "output.html"));
           }
       }
   );
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

//module.exports.handler = serverless(app);
