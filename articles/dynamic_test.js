// JavaScript for dynamic content 

//const specificDate = "2025-08-07";
today = new Date();
const specificDate = today.toISOString().split('T')[0];
console.log(specificDate)

fetch('articles.json')
.then(response => response.json())
.then(dataArray => {
  const data = dataArray.find(article => article.date === specificDate);
  if (!data) {
    document.getElementById('article-date').textContent = 'No articles found for ' + specificDate;
    return;
  }

  document.getElementById('article-date').textContent = 'Date: ' + data.date;

  const contentDiv = document.getElementById('article-content');
  contentDiv.innerHTML = '';


  /* Rendering the Headline */ 

  if (data.headline) {
    const headline = document.createElement('p');
    headline.innerHTML = `<strong>${data.headline}</strong>`
    contentDiv.appendChild(headline);
  }


  /* 
  data.paragraphs.forEach(para => {
    const p = document.createElement('p');
    p.textContent = para;
    contentDiv.appendChild(p);

  }

);
*/

/* Rendering the Paragraph */ 

const singleParagraph = document.createElement('p');
singleParagraph.innerHTML = data.paragraphs.join('<br><br>');
contentDiv.appendChild(singleParagraph);

/* Rendering the Paragraph */ 

const auther = document.createElement('p')
auther.className = 'auther';
auther.textContent = `Auther - ${data.author}`;
contentDiv.appendChild(auther);


});