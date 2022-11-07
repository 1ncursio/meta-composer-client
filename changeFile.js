process.argv.shift();
process.argv.shift();
inputData = process.argv.join(' ');
console.log(inputData);

const { default: axios } = require('axios');
var fs = require('fs');
var koData = JSON.parse(fs.readFileSync('public/locales/ko/common.json').toString());
var enData = JSON.parse(fs.readFileSync('public/locales/en/common.json').toString());
var jaData = JSON.parse(fs.readFileSync('public/locales/ja/common.json').toString());

koData[inputData] = inputData;

fs.writeFileSync('public/locales/ko/common.json', JSON.stringify(koData));

try {
  var client_id = 'D2E5jX4B9fBfIvI9GZCT';
  var client_secret = 'HIaffOHWES';
  var query = inputData;

  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  var request = require('request');
  //일본어
  var options = {
    url: api_url,
    form: { source: 'ko', target: 'ja', text: query },
    headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret },
  };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      jaData[inputData] = JSON.parse(body).message.result.translatedText;
      fs.writeFileSync('public/locales/ja/common.json', JSON.stringify(jaData));
      console.log('일본어: ' + jaData[inputData]);
    } else {
      console.log('error = ' + response.statusCode);
    }
  });

  //영어
  options.form.target = 'en';
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      enData[inputData] = JSON.parse(body).message.result.translatedText;
      fs.writeFileSync('public/locales/en/common.json', JSON.stringify(enData));
      console.log('영어: ' + enData[inputData]);
    } else {
      console.log('error = ' + response.statusCode);
    }
  });
} catch (err) {
  console.log('에러남 api 아이디 확인해라잉');
}
