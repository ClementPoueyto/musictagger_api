import { User } from "src/api/user/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class SpotifyUser extends BaseEntity{
    
    @PrimaryColumn({ type: 'varchar', unique: true })
    spotifyId : string;

    @Column({ type: 'varchar'})
    spotifyAccessToken : string;

    @Column({ type: 'varchar'})
    spotifyRefreshToken : string;

    @Column()
    expiresIn : number;

    @Column()
    tokenCreation : Date;

    @OneToOne(
      () => User, user=>user.spotifyUser,
      {
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
  
      }
    )
    public user: User;
}