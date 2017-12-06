import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import {File} from "@ionic-native/file";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {DomSanitizer} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-list-photo',
  templateUrl: 'list-photo.html',
})
export class ListPhotoPage {

  pictures: any[];
  listFile: Array<any> = new Array();
  metadata: any;
  loading: Loading;
  options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.NATIVE_URI,
    allowEdit: false,
    sourceType: this.camera.PictureSourceType.CAMERA,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              private file: File, public loadingCtrl: LoadingController, private photoViewer: PhotoViewer,
              private camera: Camera, public platform: Platform, private _sanitizer: DomSanitizer) {
    this.platform.ready().then(() => {
      this.showLoading();
      this.listDir();
    })
  }

  listDir() {
    this.file.listDir('file:///storage/emulated/0/Android/data/io.ionic.camera/', 'files').then(res => {
      console.log(res)
      this.pictures = res;
      this.listFile = [];
      let that = this;
      for (let p of this.pictures) {
        p.file(function (file) {
          console.log(file)
          file.size = (file.size / 1024 / 1024).toFixed(2).split('.').join(',') + ' MB';
          file.lastModified = new Date(file.lastModified).toString();
          let array = file.lastModified.split(' ');
          switch (array[1]) {
            case 'Jan':
              array[1] = '01';
              break;
            case 'Feb':
              array[1] = '02';
              break;
            case 'Mar':
              array[1] = '03';
              break;
            case 'Apr':
              array[1] = '04';
              break;
            case 'May':
              array[1] = '05';
              break;
            case 'Jun':
              array[1] = '06';
              break;
            case 'Jul':
              array[1] = '07';
              break;
            case 'Aug':
              array[1] = '08';
              break;
            case 'Sep':
              array[1] = '09';
              break;
            case 'Oct':
              array[1] = '10';
              break;
            case 'Nov':
              array[1] = '11';
              break;
            case 'Dec':
              array[1] = '12';
              break;
          }
          file.lastModified = array[2] + '/' + array[1] + '/' + array[3] + ' ' + array[4];
          that.listFile.push(file)
        })
      }
      this.loading.dismiss();
    }, err => {
      console.error(err)
    })
  }

  takePhoto() {
    this.camera.getPicture(this.options).then(pic => {
      let pat = pic.split('/')
      let name = pat[pat.length - 1]
      this.file.moveFile('file:///storage/emulated/0/Android/data/io.ionic.camera/cache', name,
        'file:///storage/emulated/0/Android/data/io.ionic.camera/files', name).then(() => {
        this.showLoading();
        this.listDir();
      })
    }, err => {
      console.log(err)
    })
  }

  sanitizeUrl(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openPhoto(photo) {
    console.log(photo)
    let pat = photo.split('/')
    let name = pat[pat.length - 1]
    let url = 'file:///storage/emulated/0/Android/data/io.ionic.camera/files/' + name;
    this.photoViewer.show(url);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.listDir();
      refresher.complete();
    }, 2000);
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Photo',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Caricamento..."
    });
    this.loading.present();
  }

}
