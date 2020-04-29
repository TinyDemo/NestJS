import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  avatar: string;
  @Column()
  nickname: string;
  @Column({ nullable: true })
  phoneAreaCode: string;
  @Column({ nullable: true })
  phoneNumber: string;
  @Column({ name: 'email_verified_at', type: 'datetime', nullable: true })
  emailVerifiedAt: Date;
  @Column({ name: 'phone_verified_at', type: 'datetime', nullable: true })
  phoneVerifiedAt: Date;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
