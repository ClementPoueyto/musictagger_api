import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Playlist extends BaseEntity{
    @PrimaryGeneratedColumn()
    public id: string;
}