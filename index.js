const { getSession, getTokenCsrf, getAllDataUser, fetch} = require('./CelebianAPI');
const readline = require('readline-sync');
const {createWriteStream} = require('node:fs');
const {pipeline} = require('node:stream');
const {promisify} = require('node:util');
const chalk = require('chalk');
const streamPipeline = promisify(pipeline);
const fs = require('fs');
// const { exec } = require('node:child_process');
// const { exit } = require('node:process');



async function start(){


    let username = readline.question(chalk.greenBright('Masukan Username Tiktok : '));
    let dir =  `./${username}`;
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }


    let session = await getSession(); 
    let csrf = await getTokenCsrf(session[1]);

    let regex = /(token: "[a-z,A-Z,0-9])\w+/g;
    let csrfMatch = csrf.match(regex)[0].split('"')[1];

    let dataUser = await getAllDataUser(username, session[1], csrfMatch);

        if(dataUser.success == false){
            console.log(dataUser.msg);
        }else{
            for (let index = 0; index < dataUser.posts.length; index++) {
                console.log(chalk`{blueBright Proses Download Video :} video_${index}_${dataUser.posts[index].id}.mp4`);
                const response = await fetch(dataUser.posts[index].video);
                await streamPipeline(response.body, createWriteStream(`./${dir}/video_${index}_${dataUser.posts[index].id}.mp4`));
                
            }
        }
    
    
    

}


start();