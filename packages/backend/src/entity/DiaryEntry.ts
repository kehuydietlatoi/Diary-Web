import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Label } from './label';
import { IsDate } from 'class-validator';

@Entity()
export class DiaryEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  text: string;

  // i use timestamp cause i (or mysql) have problem with current date
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  date: Date;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToMany(() => Label, (label) => label.diaryEntries, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  labels: Label[];
}
