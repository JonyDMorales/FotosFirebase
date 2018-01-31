import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';

@Injectable()
export class CargaImagenesService {
    
    private CARPETA = 'img';

    constructor(private db: AngularFirestore) { }

    private saveImg( imagen: { nombre:string, url:string } ){
        this.db.collection(`/${ this.CARPETA }`).add(imagen);
    }

    public uploadImg(imagenes: FileItem [] ){
        const STORAGE = firebase.storage().ref();
        for(const item of imagenes){
            item.estaSubiendo = true;
            if( item.progreso >= 100 ){
                continue;
            }
            const uploadTask: firebase.storage.UploadTask = STORAGE.child(` ${ this.CARPETA }/${ item.nombre } `).put( item.archivo );
            uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED, 
                ( snapshot:firebase.storage.UploadTaskSnapshot ) => item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
                ( error ) => console.error( error ),
                () => {
                    console.log( 'imagen cargada correctamente' );
                    item.url = uploadTask.snapshot.downloadURL;
                    item.estaSubiendo = false;
                    this.saveImg({ nombre: item.nombre, url: item.url });
                }
            ); 
        }
    }

}
