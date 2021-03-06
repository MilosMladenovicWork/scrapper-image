let dataLoading = false
let urls = []

document.querySelector('.input-url').focus();

function fetchAndDisplayData(dataLoading, urls, e){
  e.preventDefault()
    if(document.querySelector('.img-box')){
      document.body.removeChild(document.querySelector('.img-box'))
    }
    if(document.querySelector('.loading-spinner')){
      document.querySelector('.input-area').removeChild(document.querySelector('.loading-spinner'))
    }
    if(document.querySelector('.status-container')){
        document.body.removeChild(document.querySelector('.status-container'))
    }
    if(document.querySelector('.image-loading-progress')){
      document.querySelector('.image-loading-progress').parentNode.removeChild(document.querySelector('.image-loading-progress'))
    }
    let input = document.querySelector('[name="url"]').value;
    
    let fetchFeaturedImages = document.querySelector('[name="fetchFeaturedImages"]').checked;

    let featuredImagesSources = document.querySelector('[name="featuredImagesSources"]').value;

    dataLoading = true;

    let statusContainer = document.createElement('div')
    statusContainer.className = 'status-container justify-content-center row p-3'
    document.body.appendChild(statusContainer)
    if(dataLoading){
      let spinnerBorder = document.createElement('div')
      spinnerBorder.className = 'loading-spinner spinner-border text-primary'
      spinnerBorder.setAttribute('role', 'status')
      let spinnerSpan = document.createElement('span')
      spinnerSpan.className='sr-only'
      spinnerSpan.innerText = 'Loading...'
      spinnerBorder.appendChild(spinnerSpan)
      document.querySelector('.status-container').appendChild(spinnerBorder)
      document.title = 'Fetching...'
    }

    let fetchURL = `https://scrapper-image.herokuapp.com/?url=${input}`
    
    if(fetchFeaturedImages){
      fetchURL = `https://scrapper-image.herokuapp.com/fetchFeaturedImages/?url=${input}&src=${featuredImagesSources}`
    }

    fetch(fetchURL, {
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method:'GET',
        mode:'cors'
      })
      .then(data => data.json())
      .then(data => {
        document.querySelector('.input-url').focus();

        dataLoading = false
        if(!dataLoading){
          document.querySelector('.status-container').removeChild(document.querySelector('.loading-spinner'))
          let successStatus = document.createElement('span')
          successStatus.innerText = `✔ Fetched`
          let alert = document.createElement('div')
          alert.className = 'alert alert-success'
          alert.appendChild(successStatus)
          document.querySelector('.status-container').appendChild(alert)
          document.title = '✔Fetched'
        }
        urls = data
        console.log(urls)
        let imgBox = document.createElement('div')
        document.body.appendChild(imgBox)
        imgBox.className = 'img-box container-fluid row row-cols-1 row-cols-sm-3 row-cols-xl-5'
        urls.forEach(url => {
          let lazyLoadImage = url.match(/LazyLoad/gi)
          if(!lazyLoadImage){
            let imageContainer = document.createElement('div')
            imageContainer.className = 'col col-px-2 mt-4'
            let image = document.createElement('img')
            image.className = 'col shadow-sm rounded'
            image.setAttribute('src', url)
            imageContainer.appendChild(image)
            let tooltip = document.createElement('p')
            tooltip.className = 'alert alert-danger'
            tooltip.innerText = '❌Click to remove image'
            imageContainer.appendChild(tooltip)
            document.querySelector('.img-box').appendChild(imageContainer)
          }
        })

        let allPics = Array.from(document.images)

        let allPicsNum = allPics.length

        let imagesLoaded = 0

        let progressContainer = document.createElement('div')
        progressContainer.className = 'image-loading-progress progress'
        let progressBar = document.createElement('div')
        progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated'
        progressContainer.appendChild(progressBar)
        document.body.appendChild(progressContainer)

        let loadingBarFill = (width) => {
          progressBar.style = `width:${width}%`
          if(width > 99){
            setTimeout(() => progressContainer.style = 'transition:0.5s;opacity:0', 1000)
          }
        }

        Promise.all(allPics.filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = function() {
          imagesLoaded += 1 ;
          loadingBarFill(imagesLoaded / allPicsNum * 100);
          return resolve()
        }; }))).then(() => {
          console.log('images finished loading');
        }); 

        let imageDivElements = document.querySelectorAll('.img-box > div')

        for(let numOfElement = 0; numOfElement < imageDivElements.length; numOfElement++){
          let node = imageDivElements[numOfElement]
          node.addEventListener('click', () => {
            node.parentNode.removeChild(node)
          })
        }
        
      })
      .catch(e => {
        document.querySelector('.input-url').focus();
        
        dataLoading = false
        if(!dataLoading){
          if(document.querySelector('.loading-spinner')){
            document.querySelector('.status-container').removeChild(document.querySelector('.loading-spinner'))
          }
          let errorStatus = document.createElement('span')
          errorStatus.innerText = `❌ ${e}`
          let alert = document.createElement('div')
          alert.className = 'alert alert-danger'
          alert.appendChild(errorStatus)
          document.querySelector('.status-container').appendChild(alert)
          document.title = '❌Failed to fetch'
        }
        console.log(e)
      })
    console.log(urls)
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#fetch').addEventListener('click', (event) => {
    fetchAndDisplayData(dataLoading, urls, event)
  })

}
)

document.querySelector('.input-url').addEventListener('keyup', (event) => {
  if(event.keyCode === 13){
    fetchAndDisplayData(dataLoading, urls, event)
  }
})