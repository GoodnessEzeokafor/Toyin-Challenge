// Smart Contract Codes
const contractSource = `
contract BucketList =
  record bucketlist= {name:string, owner:address}

  record state = {
    index_counter : int,
    bucketlists : map(int, bucketlist)}
    
  stateful entrypoint init() =
    { index_counter = 0,
      bucketlists = {} }
  
  entrypoint get_caller() =
    Call.caller
    
  stateful entrypoint add_new_bucketlist(_newbucketlist : string)=
    let new_bucketlist ={name =_newbucketlist, owner=Call.caller}
    let index = state.index_counter + 1
    put(state{bucketlists[index] = new_bucketlist, index_counter=index})
      
  entrypoint get_bucket_list_length() : int = 
    state.index_counter
    
  entrypoint get_bucketlist_by_index(_index:int)=
    switch(Map.lookup(_index, state.bucketlists))
      None => abort("There was no bucketlis with this index.")
      Some(x) => x
      
`



// Deployed Contract Address
var contractAddress = "ct_afybJhD2pHkgfuY9y3c6kMqktumN9nfYBcCkN8yeiyui2Ein3"
var client = null // client defuault null
var bucketlist_arr = [] // empty arr
var bucketlists_length = 0 // empty bucjetlist list lenghth



//Reading From The Blockchain
async function callStatic(func, args) {
    const contract = await client.getContractInstance(contractSource, {contractAddress});
    const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
    const decodedGet = await calledGet.decode().catch(e => console.error(e));
    return decodedGet;
}
  
//Create a asynchronous write call for our smart contract
// Writing into the Blockhain
async function contractCall(func, args, value) {
    const contract = await client.getContractInstance(contractSource, {contractAddress});
    console.log("Contract:", contract)
    const calledSet = await contract.call(func, args, {amount:value}).catch(e => console.error(e));
    console.log("CalledSet", calledSet)
    return calledSet;
}


function renderBucketList(){
    let template = $('#template').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, {articleListArr});
    $("#bucketlistBody").html(rendered);
    console.log("Mustashe Template Display")
}


window.addEventListener('load', async()=>{
    client = await Ae.Aepp();
    bucketlistListLength = await callStatic('getArticleLength',[]);
    bucketlist_owner = await callStatic('get_caller',[])

})


console.log("bucketlistListLength:", bucketlistListLength)
console.log("Owner:",bucketlist_owner)