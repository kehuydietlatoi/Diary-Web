import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import { Connection, createConnection, getConnectionOptions, ObjectType } from 'typeorm';
import { globalRouter } from '../src/router/global.router';

export class Helper {
  public app: Express | null;
  private dbConnection: Connection;

  public async init() {
    jest.setTimeout(10000);
    this.app = express();
    this.app.use(bodyParser.json());

    this.app.use('/api', globalRouter);
    const config = await getConnectionOptions('default');
    this.dbConnection = await createConnection(
      // tslint:disable-next-line: prefer-object-spread
      Object.assign({}, config, { database: process.env.DBDATABASE }),
    );
    await this.resetDatabase();
  }
  public resetDatabase = async () => {
    await this.dbConnection.synchronize(true);
  };
  public async shutdown() {
    return this.dbConnection.close();
  }

  public getConnection() {
    return this.dbConnection;
  }

  public getRepo<Entity>(target: ObjectType<Entity>) {
    return this.dbConnection.getRepository(target);
  }
}
