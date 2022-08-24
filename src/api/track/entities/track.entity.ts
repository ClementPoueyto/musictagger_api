import { TaggedTrack } from "src/api/tagged-track/entities/tagged-track.entity";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SpotifyTrack } from "./spotify-track.entity";

@Entity()
@Unique(["artistName", "title", "albumTitle"])
export class Track extends BaseEntity{

    @PrimaryGeneratedColumn()
    id : string;

    @Column(()=> SpotifyTrack)
    spotifyTrack : SpotifyTrack;

    @Column({ type: 'varchar'})
    artistName : string;

    @Column({ type: 'varchar'})
    albumTitle : string;

    @Column('text', { array: true })
    artists : string[]

    @Column({ type: 'varchar'})
    title : string;

    @Column({ type: 'varchar', nullable : true})
    image? : string;

    @Column({nullable : true})
    duration? : number;

    @OneToMany(() => TaggedTrack, tt=> tt.track, { eager : false})
    taggedTracks : TaggedTrack[]
}