import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Provider {
  FITNES = 'fitnes',
  ZDRAVNIK = 'zdravnik',
  FRIZER = 'frizer',
}

@Entity('appointment_slots')
@Index(['provider', 'startsAt'], { unique: true })
export class AppointmentSlotEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: Provider })
  provider!: Provider;

  @Column({ type: 'timestamptz' })
  startsAt!: Date;

  @Column({ type: 'timestamptz' })
  endsAt!: Date;

  @Column({ type: 'text', nullable: true })
  reservedByUserId!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reservedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
