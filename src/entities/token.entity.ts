import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('token')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'user_id' })
  userId: number;
  @Column({ nullable: true })
  ua: string;
  @Column({ nullable: true })
  ip: string;
  @Column()
  token: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
