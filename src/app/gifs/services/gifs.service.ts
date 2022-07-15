import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey    : string = 'CpIbNYWeRcxjrThHFiNhT0vfE5aZfOsw';
  private _historial: string[] = [];

  // TODO: Cambiar any por su tipo de dato
  public resultados: any[] = [];

  // El [] es para quitar la referencia al objeto
  get historial() {
    return [...this._historial]
  }

  constructor( private http: HttpClient ) { }

  /* Primero se válida que el data ingresado no este repetido para no sobrepasar 
  siempre evaluaremos los parametros que recibimos que no sobrepasen de 10 elementos 
  primero lo insertamos y luego lo cortamos
  */
  buscarGifs( query: string = '' ) {

    query = query.trim().toLocaleLowerCase();

    if ( !this._historial.includes( query ) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);
    }

    // objeto para htpp, retorno de observables para que se pueda subscribir la información enviada
    this.http.get(`api.giphy.com/v1/gifs/search?api_key=CpIbNYWeRcxjrThHFiNhT0vfE5aZfOsw&q=${ query }&limit=10`)
      .subscribe( ( resp: any ) => {
        console.log( resp.data );
        this.resultados = resp.data;
      });

    /*
      fetch( 'api.giphy.com/v1/gifs/search?api_key=CpIbNYWeRcxjrThHFiNhT0vfE5aZfOsw&q=dragon ball z&limit=10')
      .then( resp => {
        resp.json().then( data => {
          console.log(data);
        }) 
      })
    */

    // Otra forma de hacerlo, pero hay muchos errores y cambias que hacer
    /* 
      const resp = await fetch( 'api.giphy.com/v1/gifs/search?api_key=CpIbNYWeRcxjrThHFiNhT0vfE5aZfOsw&q=dragon ball z&limit=10' );
      const data = await resp.json();
      console.log(data);
    */

  }

}
