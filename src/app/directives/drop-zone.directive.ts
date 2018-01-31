import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
    selector: '[appDropZone]'
})
export class DropZoneDirective {
    @Input() archivos: FileItem[] = [];
    @Output() mouse: EventEmitter<boolean> = new EventEmitter(); 

    constructor() { }
    
    @HostListener('dragover', ['$event'])
    public dragEnter( event:any ){
        this.mouse.emit( true );
        this._prevenir( event );
    }

    @HostListener('dragleave', ['$event'])
    public dragLeave( event:any ){
        this.mouse.emit( false );
        this._prevenir( event );
    }

    @HostListener('drop', ['$event'])
    public drop( event:any ){
        const DATA = this._getData( event );
        if( !DATA ){
            return;
        }
        this._extraerArchivos( DATA.files );
        this._prevenir( event );
        this.mouse.emit( false );
    }

    private _getData( event:any ){
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }

    private _extraerArchivos( archivosLista: FileList ){
        //console.log( archivosLista );
        for(const PROPIEDAD in Object.getOwnPropertyNames( archivosLista )){
            const archivoTemporal = archivosLista[PROPIEDAD];
            if( this._archivoPuedeSerCargado(archivoTemporal) ){
                const nuevo = new FileItem(archivoTemporal);
                this.archivos.push(nuevo);
            }
        }
        console.log( this.archivos );
    }
    //Validaciones
    private _archivoPuedeSerCargado( archivo:File ):boolean{
        if( !this._noRepetir( archivo.name ) && this._esImg( archivo.type ) ){
            return true;
        }
        return false;
    }

    private _prevenir( event ){
        event.preventDefault();
        event.stopPropagation();
    }

    private _noRepetir( nombre:string ):boolean{
        for(let archivo of this.archivos){
            if(archivo.nombre == nombre){
                console.log('El archivo se repite');
                return true;
            }
        }
        return false;
    }

    private _esImg( tipo:string):boolean{
        return ( tipo == '' || tipo == undefined ) ? false : tipo.startsWith('image');
    }
}
