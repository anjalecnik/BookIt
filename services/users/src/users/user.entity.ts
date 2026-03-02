import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ name: 'google_sub', type: 'text' })
  googleSub!: string;

  @Column({ type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ name: 'picture_url', type: 'text', nullable: true })
  pictureUrl!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}