import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { SearchGifsResponse, Gif } from '../interface/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey    : string = 'CpIbNYWeRcxjrThHFiNhT0vfE5aZfOsw';
  private servicioUrl: string = 'http://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  // El [] es para quitar la referencia al objeto
  get historial() {
    return [...this._historial]
  }

  constructor( private http: HttpClient ) { 

    this._historial = JSON.parse( localStorage.getItem( 'historial' ) || '[]' );

    this.resultados = JSON.parse( localStorage.getItem( 'resultados' ) || '[]' );

    /*
      if ( localStorage.getItem( 'historial' ) ) {
        this._historial = JSON.parse( localStorage.getItem( 'historial' )! );
      }
    */

  }

  /* Primero se válida que el data ingresado no este repetido para no sobrepasar 
  siempre evaluaremos los parametros que recibimos que no sobrepasen de 10 elementos 
  primero lo insertamos y luego lo cortamos
  */
  buscarGifs( query: string = '' ) {

    query = query.trim().toLocaleLowerCase();

    if ( !this._historial.includes( query ) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      // Guardamos el historial en localStorage para que no se pierda cuando se recargue la página
      localStorage.setItem( 'historial', JSON.stringify( this._historial ));

    }

    const params = new HttpParams()
      .set( 'api_key', this.apiKey )
      .set( 'q', query )
      .set( 'limit', '10' );

    // objeto para htpp, retorno de observables para que se pueda subscribir la información enviada
    // La respuesta luce como la interfa searchGifsResponse
    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
      .subscribe( ( resp ) => {
        this.resultados = resp.data;
        // Guardamos las imágenes en el localStorage para que no se pierda cuando se recargue la página
        localStorage.setItem( 'resultados', JSON.stringify( this.resultados ));
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
