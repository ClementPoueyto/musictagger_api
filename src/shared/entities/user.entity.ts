import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SpotifyUser } from './spotify/spotify-user.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  public email: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  public password?: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  public firstname?: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  public lastname?: string;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;

  @JoinColumn()
  @OneToOne(() => SpotifyUser, (spotifyUser: SpotifyUser) => spotifyUser.user, {
    nullable: true,
    cascade: true,
  })
  public spotifyUser?: SpotifyUser | null;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 8);
  }

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    if (this.password) {
      return await bcrypt.compare(password, this.password);
    }
    return false;
  }
}
