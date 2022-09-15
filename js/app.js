function $(id) {
    return document.getElementById(id)
}

const form = $('form')

form.addEventListener('submit', function (e) {
    e.preventDefault();
    // console.log(this)
})

