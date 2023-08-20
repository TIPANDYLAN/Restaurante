/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     4/8/2023 10:14:19                            */
/*==============================================================*/

create database Restaurant;

use Restaurant;

drop table if exists CLIENTE;

drop table if exists EMPLEADO;

drop table if exists ENTREGA;

drop table if exists INGREDIENTES;

drop table if exists INVENTARIO;

drop table if exists ORDEN;

drop table if exists PEDIDO;

drop table if exists PLATO;

drop table if exists PROVEEDOR;

drop table if exists RECETA;

/*==============================================================*/
/* Table: CLIENTE                                               */
/*==============================================================*/
create table CLIENTE
(
   CEDULA_CL            varchar(15) not null,
   NOMBRE_CL            text not null,
   CORREO_CL            text,
   TELEFONO_CL          varchar(15),
   DIRECCION_CL         text,
   primary key (CEDULA_CL)
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
   ID_EN                int not null,
   ID_PR                int,
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
   ID_I                 int not null,
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
   ID_INV               int not null,
   ID_EN                int,
   ID_I                 int,
   TOTAL_INV      bigint not null,
   primary key (ID_INV)
);

/*==============================================================*/
/* Table: ORDEN                                                 */
/*==============================================================*/
create table ORDEN
(
   ID_OR                int auto_increment not null,
   CEDULA_CL            varchar(15),
   ID_EMP               int,
   FECHA_OR             date not null,
   NMESA_OR             bigint,
   DESCRIPCION_OR       text,
   ESTADO_OR            varchar(20),
   primary key (ID_OR)
);

/*==============================================================*/
/* Table: PEDIDO                                                */
/*==============================================================*/
create table PEDIDO
(
   ID_PL                int not null,
   ID_OR                int not null,
   PRECIO_PE            DECIMAL(20,2),
   CANTXPLA_PE          numeric(50,0) not null,
   ESTADO_PE			varchar(20) not null,
   CANTREALIZADA_PE		bigint,
   primary key (ID_PL, ID_OR)
);

/*==============================================================*/
/* Table: PLATO                                                 */
/*==============================================================*/
create table PLATO
(
   ID_PL                int auto_increment not null,
   NOMBRE_PL            varchar(100) not null,
   PRECIO_PL            DECIMAL(20, 2) not null,
   FOTO_PL              text not null,
   CATEGORIA_PL         varchar(40),
   ESTADO_PL            TINYINT(1),
   primary key (ID_PL)
);

/*==============================================================*/
/* Table: PROVEEDOR                                             */
/*==============================================================*/
create table PROVEEDOR
(
   ID_PR                int not null,
   NOMBRE_PR            text not null,
   DESCRIPCION_I        text not null,
   primary key (ID_PR)
);

/*==============================================================*/
/* Table: RECETA                                                */
/*==============================================================*/
create table RECETA
(
   ID_RE                int not null,
   ID_I                 int not null,
   ID_PL                int,
   PESO_RE              float not null,
   DESCRIPCION_RE       text not null,
   NOMBRE_RE            text not null,
   primary key (ID_RE)
);

alter table INVENTARIO add constraint FK_PROVEEN foreign key (ID_I)
      references INGREDIENTES (ID_I) on delete restrict on update restrict;

alter table ENTREGA add constraint FK_REALIZA foreign key (ID_PR)
      references PROVEEDOR (ID_PR) on delete restrict on update restrict;

alter table INVENTARIO add constraint FK_LLENA foreign key (ID_EN)
      references ENTREGA (ID_EN) on delete restrict on update restrict;

alter table ORDEN add constraint FK_ATIENDE foreign key (ID_EMP)
      references EMPLEADO (ID_EMP) on delete restrict on update restrict;

alter table ORDEN add constraint FK_PIDE foreign key (CEDULA_CL)
      references CLIENTE (CEDULA_CL) on delete restrict on update restrict;

alter table PEDIDO add constraint FK_CONTIENE foreign key (ID_OR)
      references ORDEN (ID_OR) on delete restrict on update restrict;

alter table PEDIDO add constraint FK_GENERAN foreign key (ID_PL)
      references PLATO (ID_PL) on delete restrict on update restrict;

alter table RECETA add constraint FK_CONFORMAN foreign key (ID_I)
      references INGREDIENTES (ID_I) on delete restrict on update restrict;

alter table RECETA add constraint FK_TIENE foreign key (ID_PL)
      references PLATO (ID_PL) on delete restrict on update restrict;

