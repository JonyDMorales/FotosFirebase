import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
    selector: 'app-carga',
    templateUrl: './carga.component.html',
    styles: []
})

export class CargaComponent implements OnInit {

    public archivos: FileItem[] = [];
    public dropZone:boolean = false;

    constructor(public _cargaImagenes: CargaImagenesService) { }

    ngOnInit() {}
    
    public cargarImg(){
        this._cargaImagenes.uploadImg( this.archivos );
    }

    public clean(){
        this.archivos = [];
    }
}
