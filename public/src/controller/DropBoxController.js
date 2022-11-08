class DropBoxController {
    constructor() {
      this.btnSendFileEl = document.querySelector("#btn-send-file");
      this.inputFilesEl = document.querySelector("#files");
      this.snackModalEl = document.querySelector("#react-snackbar-root");
      this.progessBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
      this.nameFileEl = this.snackModalEl.querySelector('.filename');
      this.timeleftEl = this.snackModalEl.querySelector('.timeleft');
      this.initEvents();
    }
  
    initEvents() {
      this.btnSendFileEl.addEventListener("click", (event) => {
        this.inputFilesEl.click();
      });
  
      this.inputFilesEl.addEventListener("change", (event) => {
        this.uploadTask(event.target.files)
        
        this.modalShow();

        this.inputFilesEl.value = ''
      });
    }

    modalShow(show = true){
      this.snackModalEl.style.display = (show) ? 'block' : 'none'
    }
  
    uploadTask(files) {
      let promises = [];
  
      /* files vem como coleção, tem que converder em array*/
      [...files].forEach( (file) => {
        promises.push( new Promise((resolve, reject) => {
          let ajax = new XMLHttpRequest();
  
          ajax.open('POST', '/upload')
  
          ajax.onload = event => {
            this.modalShow(false)
            try {
              resolve(JSON.parse(ajax.responseText)) /* responseText -> resposta do servidor */
            } catch (e) {
              reject(e)
            }
          }
  
          ajax.onerror = event => {
            this.modalShow(false);
            reject(event)
          }

          ajax.upload.onprogress = event => {
            this.uploadProgress(event, file)
          }
  
          let formData = new FormData() /* Ler os arquivos */
  
          formData.append('input-file', file);

          this.startUploadTime = Date.now()
  
          ajax.send(formData);
        }))
      })
  
      return Promise.all(promises) /* Se for sucesso da resolve, se der problema: reject  */
    }
  
    uploadProgress(event, file) {

      let timeSpent = Date.now() - this.startUploadTime;
      let loaded = event.loaded;/* mb */
      let total = event.total;/* mb */
      let porcent = parseInt((loaded / total) * 100);
      let timeLeft = (100 - porcent) * timeSpent / porcent ; /* Regra de 3 */
      
      this.progessBarEl.style.width = `${porcent}%`
      this.nameFileEl.innerHTML = file.name;
      this.timeleftEl.innerHTML = this.formatTime(timeLeft);
    }

    formatTime(duration){
      
      let seconds = parseInt(duration / 1000) % 60;
      let minutes = parseInt((duration / (1000 * 60)) % 60);
      let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

      if (hours > 0) {
        return `${hours} horas, ${minutes} minutos e ${seconds} segundos`
      }
      if (minutes > 0) {
        return ` ${minutes} minutos e ${seconds} segundos`
      }
      if (seconds > 0) {
        return `${seconds} segundos`
      }

      return '';
      
    }
  }
  