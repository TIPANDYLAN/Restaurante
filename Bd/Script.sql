/* Crear la base de datos */
CREATE DATABASE Restaurant;

/* Seleccionar la base de datos */
USE Restaurant;


/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     30/7/2023 12:15:41                           */
/*==============================================================*/

drop table if exists PEDIDO;
drop table if exists RECETA;
drop table if exists PLATO;
drop table if exists PROVEEDOR;
drop table if exists INVENTARIO;
drop table if exists RECETA;
drop table if exists ORDEN;
drop table if exists INGREDIENTES;
drop table if exists ENTREGA;
drop table if exists EMPLEADO;
drop table if exists CLIENTE;

/*==============================================================*/
/* Table: CLIENTE                                               */
/*==============================================================*/
create table CLIENTE
(
   ID_CL                smallint not null,
   NOMBRE_CL            text not null,
   CORREO_CL            text not null,
   TELEFONO_CL          numeric(8,0) not null,
   DIRECCION_CL         text not null,
   CEDULA_CL            int not null,
   primary key (ID_CL)
);

/*==============================================================*/
/* Table: EMPLEADO                                              */
/*==============================================================*/
create table EMPLEADO
(
   ID_EMP               int not null,
   USUARIO_EMP          longtext,
   CONTRASENA_EMP       longtext,
   CARGO_EMP            longtext,
   primary key (ID_EMP)
);

/*==============================================================*/
/* Table: ENTREGA                                               */
/*==============================================================*/
create table ENTREGA
(
   ID_EN                smallint not null,
   ID_I                 smallint not null,
   ID_PR                smallint not null,
   FECHA_EN             date not null,
   TIPO_EN              text not null,
   CANTIDAD_EN          float not null,
   primary key (ID_EN)
);

/*==============================================================*/
/* Table: INGREDIENTES                                          */
/*==============================================================*/
create table INGREDIENTES
(
   ID_I                 smallint not null,
   NOMBRE_I             text not null,
   DESCRIPCION_I        text not null,
   PRECIO_I             float not null,
   primary key (ID_I)
);

/*==============================================================*/
/* Table: INVENTARIO                                            */
/*==============================================================*/
create table INVENTARIO
(
   ID_EN                smallint not null,
   ID_INV               smallint not null,
   DESCRIPCION_INV      text not null,
   primary key (ID_INV)
);

/*==============================================================*/
/* Table: ORDEN                                                 */
/*==============================================================*/
create table ORDEN
(
   ID_OR                smallint not null,
   ID_CL                smallint not null,
   ID_EMP               int,
   FECHA_OR             date not null,
   NMESA_OR             numeric(20,0) not null,
   DESCRIPCION_OR       text not null,
   primary key (ID_OR)
);

/*==============================================================*/
/* Table: PEDIDO                                                */
/*==============================================================*/
create table PEDIDO
(
   ID_PE                smallint not null,
   ID_PL                smallint not null,
   ID_OR                smallint not null,
   ID_INV               smallint not null,
   PRECIO_PE            real,
   primary key (ID_PE)
);

/*==============================================================*/
/* Table: PLATO                                                 */
/*==============================================================*/
CREATE TABLE PLATO
(
   ID_PL                SMALLINT NOT NULL AUTO_INCREMENT,
   NOMBRE_PL            VARCHAR(100) NOT NULL,
   PRECIO_PL            FLOAT NOT NULL,
   FOTO_PL              LONGBLOB NOT NULL,
   DESCRIPCION_PL       TEXT NOT NULL,
   PRIMARY KEY (ID_PL)
);


/*==============================================================*/
/* Table: PROVEEDOR                                             */
/*==============================================================*/
create table PROVEEDOR
(
   ID_PR                smallint not null,
   NOMBRE_PR            text not null,
   DESCRIPCION_I        text not null,
   primary key (ID_PR)
);

/*==============================================================*/
/* Table: RECETA                                                */
/*==============================================================*/
create table RECETA
(
   ID_RE                smallint not null,
   ID_I                 smallint not null,
   ID_PL                smallint not null,
   PESO_RE              float not null,
   DESCRIPCION_RE       text not null,
   NOMBRE_RE            text not null,
   primary key (ID_RE)
);

alter table ENTREGA add constraint FK_PROVEEN foreign key (ID_I)
      references INGREDIENTES (ID_I) on delete restrict on update restrict;

alter table ENTREGA add constraint FK_REALIZA foreign key (ID_PR)
      references PROVEEDOR (ID_PR) on delete restrict on update restrict;

alter table INVENTARIO add constraint FK_LLENA foreign key (ID_EN)
      references ENTREGA (ID_EN) on delete restrict on update restrict;

alter table ORDEN add constraint FK_ATIENDE foreign key (ID_EMP)
      references EMPLEADO (ID_EMP) on delete restrict on update restrict;

alter table ORDEN add constraint FK_PIDE foreign key (ID_CL)
      references CLIENTE (ID_CL) on delete restrict on update restrict;

alter table PEDIDO add constraint FK_CONTIENE foreign key (ID_OR)
      references ORDEN (ID_OR) on delete restrict on update restrict;

alter table PEDIDO add constraint FK_GENERAN foreign key (ID_PL)
      references PLATO (ID_PL) on delete restrict on update restrict;

alter table PEDIDO add constraint FK_REDUCE_AUMENTA foreign key (ID_INV)
      references INVENTARIO (ID_INV) on delete restrict on update restrict;

alter table RECETA add constraint FK_CONFORMAN foreign key (ID_I)
      references INGREDIENTES (ID_I) on delete restrict on update restrict;

alter table RECETA add constraint FK_TIENE foreign key (ID_PL)
      references PLATO (ID_PL) on delete restrict on update restrict;