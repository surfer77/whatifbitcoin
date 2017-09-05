//  Get params

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1, -1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}


var date = getAllUrlParams().date;
var amount = getAllUrlParams().amount;
var coin = getAllUrlParams().coin;


// api call price for specific date
var url = "https://api.coindesk.com/v1/bpi/historical/close.json?" + "start=" + date + "&end=" + date;

console.log(url);

// axios.get(url)
//   .then(function(response) {
//     var res = response.data.bpi;
//     var price = res[Object.keys(res)[0]];
//     console.log(price);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });

// api call current price
// axios.get("https://api.coindesk.com/v1/bpi/currentprice.json")
//   .then(function (response) {
//     var res = response.data.bpi.USD.rate;
//     console.log(res);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

currentPrice = 4300;
currentPriceEth = 311;
// change ui

function changeUi() {
  var amountEl = document.querySelector("#amount");
  amountEl.innerHTML = splitMille(amount);
  var dateEl = document.querySelector("#date");
  dateEl.innerHTML = decodeURI(date);
  var coinEl = document.querySelector('#coin');
  coinEl.innerHTML = coin.toUpperCase();

}


function splitMille(n, separator = ',') {
  // Cast to string
  let num = (n + '')

  // Test for and get any decimals (the later operations won't support them)
  let decimals = ''
  if (/\./.test(num)) {
    // This regex grabs the decimal point as well as the decimal numbers
    decimals = num.replace(/^.*(\..*)$/, '$1')
  }

  // Remove decimals from the number string
  num = num.replace(decimals, '')
    // Reverse the number string through Array functions
    .split('').reverse().join('')
    // Split into groups of 1-3 characters (with optional supported character "-" for negative numbers)
    .match(/[0-9]{1,3}-?/g)
    // Add in the mille separator character and reverse back
    .join(separator).split('').reverse().join('')

  // Put the decimals back and output the formatted number
  return `${num}${decimals}`
}

//calculate and get bitcoin

function makeMathBitcoin() {
  axios.get(url)
    .then(function(response) {
      var res = response.data.bpi;
      var price = res[Object.keys(res)[0]];
      var profitEl = document.querySelector("#profit");
      netProfit = Math.round(amount / price * currentPrice - amount);
      profitEl.innerHTML = splitMille(netProfit);

      var percEl = document.querySelector('#percentage');
      percEl.innerHTML = splitMille(Math.round(netProfit / amount * 100));

      var status = "If you invested $" + amount + " in Bitcoin on " + date + " you would have made $" + splitMille(netProfit) + " in profits. http://whatifbitcoin.com";

      var twitterStatus = "https://twitter.com/home?status=" + status;
      var fbStatus = "https://www.facebook.com/dialog/feed?app_id=184683071273&link=http%3A%2F%2Fwhatifbitcoin.com&picture=https%3A%2F%2Fwww.w3schools.com%2Fcss%2Ftrolltunga.jpg&name=What%20would%20happen%20if%20you%20invested%20in%20Bitcoin%3F&caption=%20&description=" + status + "&redirect_uri=http%3A%2F%2Fwww.facebook.com%2F" ;
      document.querySelector('.twitter-share-button').href = twitterStatus;
      document.querySelector('.facebookStatus').href = fbStatus;
    })
    .catch(function(error) {
      console.log(error);
    });
}

// calculate and get ethereum 

function makeMathEthereum() {
    axios.get('/js/ethereum.json')
    .then(function(response) {
      var data = response.data;
      // console.log(data[9].date.toLowerCase());
      // console.log(decodeURI(date).toLowerCase())
      for (i = 0; i < data.length; i++) {
        if (data[i].date.toLowerCase() == decodeURI(date).toLowerCase() ) {
          console.log(data[i].price);
          console.log(data[i].date);
          var price = data[i].price
          var profitEl = document.querySelector("#profit");
          netProfit = Math.round(amount / price * currentPriceEth - amount);
          profitEl.innerHTML = splitMille(netProfit);

          var percEl = document.querySelector('#percentage');
          percEl.innerHTML = splitMille(Math.round(netProfit / amount * 100));
          var status = "Ethereum.. If you invested $" + amount + " in Ethereum on " + date + " you would have made $" + splitMille(netProfit) + " in profits. http://whatifbitcoin.com";

          var twitterStatus = "https://twitter.com/home?status=" + status;
          var fbStatus = "https://www.facebook.com/dialog/feed?app_id=184683071273&link=http%3A%2F%2Fwhatifbitcoin.com&picture=https%3A%2F%2Fwww.w3schools.com%2Fcss%2Ftrolltunga.jpg&name=What%20would%20happen%20if%20you%20invested%20in%20Ethereum%3F&caption=%20&description=" + status + "&redirect_uri=http%3A%2F%2Fwww.facebook.com%2F" ;
          document.querySelector('.twitter-share-button').href = twitterStatus;
          document.querySelector('.facebookStatus').href = fbStatus;

        }
      }
      
      })
      .catch(function(err) {
        console.log(err)
      });

};

// If its bitcoin run the proper functions.
if (coin == "bitcoin") {
  // window.onload = changeAmount();
  // window.onload = changeCoin();
  // window.onload = changeDate();
  window.onload = changeUi();
  window.onload = makeMathBitcoin();
}


if (coin == 'ethereum') {
  window.onload = changeUi();
  window.onload = makeMathEthereum();
}


// math to calculate profits.

console.log(amount)


// random bg color
function ran_col() { //function name
  var color = '#'; // hexadecimal starting symbol
  var letters = ['FF8B8B', '167C80', '005397', '0BBCD6', '4F3A4B', '776EA7', 'EF303B' ]; //Set your colors here
  color += letters[Math.floor(Math.random() * letters.length)];
  document.querySelector('body').style.background = color; // Setting the random color on your div element.
}



window.onload = ran_col();


