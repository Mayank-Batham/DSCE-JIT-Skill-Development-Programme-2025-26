function display(x){
    console.log(x);
}




async function xyz() {
    return Promise.resolve("resolved");
}





async function execute(){
    try{
        let value = await xyz();
        display("Resolved");
    } catch(error){
        display("Failed");
    }
}

execute();