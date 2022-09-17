import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BaseEntity, JoinColumn, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SpotifyUser } from 'src/api/authentication/spotify-auth/entities/spotify-user.entity';

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  public email: string;

  @Column({ type: 'varchar', length: 120 })
  public password: string;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;

  @Column()
  public googleId: string;

  @JoinColumn()
  @OneToOne(
    () => SpotifyUser, spotifyUser => spotifyUser.user,
    {
      nullable: true, cascade: true

    }
  )
  public spotifyUser?: SpotifyUser;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}