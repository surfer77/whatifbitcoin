ethereumArr = [];
obj = {};
a = document.querySelectorAll('tr.text-right > td.text-left ');
b = document.querySelectorAll('tr.text-right > td:nth-child(5)');



for (i = 0; i < a.length; i++) { 
    //  ethereumArr.push({
    //     date: a[i].innerText,
    //     price: b[i].innerText,
    // });

    obj.date = a[i].innerText;
    obj.price = b[i].innerText;
    ethereumArr.push(obj)
    obj = {}
}


JSON.stringify(ethereumArr)

// var format = "https://jsonlint.com/"

// download from console

(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)