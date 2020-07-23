let dataLoading = false
let urls = []

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
    let input = document.querySelector('[name="url"]').value;
    console.log(input)
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
    }
    fetch(`https://scrapper-image.herokuapp.com/?url=${input}`, {
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        method:'GET',
        mode:'cors'
      })
      .then(data => data.json())
      .then(data => {
        dataLoading = false
        if(!dataLoading){
          document.querySelector('.status-container').removeChild(document.querySelector('.loading-spinner'))
          let successStatus = document.createElement('span')
          successStatus.innerText = `✔ Fetched`
          let alert = document.createElement('div')
          alert.className = 'alert alert-success'
          alert.appendChild(successStatus)
          document.querySelector('.status-container').appendChild(alert)
        }
        urls = data
        console.log(urls)
        let imgBox = document.createElement('div')
        document.body.appendChild(imgBox)
        imgBox.className = 'img-box container-fluid row row-cols-5'
        urls.forEach(url => {
          let imageContainer = document.createElement('div')
          let image = document.createElement('img')
          image.className = 'col shadow-sm m-3'
          image.setAttribute('src', url)
          imageContainer.appendChild(image)
          document.querySelector('.img-box').appendChild(imageContainer)
        })
        let imageDivElements = document.querySelectorAll('.img-box > div')

        for(let numOfElement = 0; numOfElement < imageDivElements.length; numOfElement++){
          let node = imageDivElements[numOfElement]
          node.addEventListener('click', () => {
            node.parentNode.removeChild(node)
          })
        }
        
      })
      .catch(e => {
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