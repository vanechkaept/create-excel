console.log('create module.js');


async function start(){
    return await Promise.resolve('async w!')
}

start().then(console.log)