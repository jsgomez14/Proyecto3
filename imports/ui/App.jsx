import React, {Component} from "react";
import PropTypes from "prop-types";
import {createContainer} from "meteor/react-meteor-data";
import InputPlayer from "./InputPlayer.jsx";
import Documento from "./Documento.jsx";
import {Usuarios} from "../api/tasks.js"
import "../../client/main.css";


/** 1. Como he mencionado en CodeReviews anteriores, no se debería incluir la carpeta node_modules en el repositorio.
 * 2.Por otro lado se debería incluir un readme con instrucciones para hacer el deploy de la aplicación.
 * 3. Con respecto al diseño, es muy simple, y el fondo de pantalla es un poco incomodo a la mirada. Se podría usar otra tecnica para el fondo de pantalla.
 * 4. No se implementaron pruebas unitarias. **/
class App extends Component {
    constructor(props) {
        super(props);

        this.onEnterPlayer = this.onEnterPlayer.bind(this);

        this.width = 800;
        this.height= 500;
        this.positionX = 0;
        this.positionY = 20;
        this.array = [];
    }

    onEnterPlayer(nombre) {

        let datos = Usuarios.find({}).fetch();
        let ultimaPosicion = datos[datos.length-1];

        if(ultimaPosicion === undefined){
            this.positionX = 10;
        }

        if(ultimaPosicion != undefined){
            this.positionX = ultimaPosicion.x + 20 + ultimaPosicion.nombre.length*8;
            this.positionY = ultimaPosicion.y;


            if(this.positionX+nombre.length > this.width-(ultimaPosicion.nombre.length*8)) {
                this.positionX = 10;
                this.positionY = ultimaPosicion.y + 20;
                this.contador = 0;
            }
        }

        let usuario = {
            nombre: nombre,
            x:this.positionX,
            y:this.positionY
        }

        //usuario._id = Usuarios.insert(usuario);
        Meteor.call('tasks.insert', usuario.nombre, usuario.x, usuario.y);

        this.setState({
            currentUsuario: usuario
        });
    }

    render() {
        return (
            <div className="padre">
                <div className="hijo">
                    <h2 id="centro">ImagiNote</h2>
                    <InputPlayer onClick = {this.onEnterPlayer}></InputPlayer>
                    <Documento width={this.width} height={this.height} usuarios={this.props.usuarios}></Documento>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    usuarios: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('tasks');
    return {
        usuarios: Usuarios.find({}).fetch()
    }
}, App);