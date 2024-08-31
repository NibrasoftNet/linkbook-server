import { Injectable } from '@nestjs/common';
import { CreateApplicantToSwapDto } from './dto/create-applicant-to-swap.dto';
import { UpdateApplicantToSwapDto } from './dto/update-applicant-to-swap.dto';

@Injectable()
export class ApplicantToSwapService {
  create(createApplicantToSwapDto: CreateApplicantToSwapDto) {
    return createApplicantToSwapDto;
  }

  findAll() {
    return `This action returns all applicantToSwap`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applicantToSwap`;
  }

  update(id: number, updateApplicantToSwapDto: UpdateApplicantToSwapDto) {
    return `This action updates a #${id} ${updateApplicantToSwapDto} applicantToSwap`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicantToSwap`;
  }
}
