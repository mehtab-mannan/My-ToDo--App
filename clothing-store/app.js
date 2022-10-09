const searchText = document.getElementById('searchtext');
const searchBtn = document.getElementById('searchBtn');
// load data
function loadData() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
    .then(data=>console.log(data))
}
loadData();