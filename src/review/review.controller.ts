import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUNDED } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorator/use-email.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUNDED, HttpStatus.NOT_FOUND);
    }
  }

  @Get('byProduct/:productId')
  async get(
    @Param('productId', IdValidationPipe) productId: string,
    @UserEmail() email: string,
  ) {
    return this.reviewService.findByProductId(productId);
  }
}
