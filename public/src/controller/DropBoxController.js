class DropBoxController {
    constructor() {
      this.btnSendFileEl = document.querySelector("#btn-send-file");
      this.inputFilesEl = document.querySelector("#files");
      this.snackModalEl = document.querySelector("#react-snackbar-root");
  
      this.initEvents();
    }
  
    initEvents() {
      this.btnSendFileEl.addEventListener("click", (event) => {
        this.inputFilesEl.click();
      });
  
      this.inputFilesEl.addEventListener("change", (event) => {
        this.uploadTask(event.target.files)
  
        this.snackModalEl.style.display = 'block'
      });
    }
  
    uploadTask(files) {
      let promises = [];
  
      /* files vem como coleção, tem que converder em array*/
      [...files].forEach( (file) => {
        promises.push( new Promise((resolve, reject) => {
          let ajax = new XMLHttpRequest();
  
          ajax.open('POST', '/upload')
  
          ajax.onload = event => {
            try {
              resolve(JSON.parse(ajax.responseText)) /* responseText -> resposta do servidor */
            } catch (e) {
              reject(e)
            }
          }
  
          ajax.onerror = event => {
            reject(event)
          }
  
          let formData = new FormData() /* Ler os arquivos */
  
          formData.append('input-file', file);
  
          ajax.send(formData);
        }))
      })
  
      return Promise.all(promises) /* Se for sucesso da resolve, se der problema: reject  */
    }
  
  
  }
  