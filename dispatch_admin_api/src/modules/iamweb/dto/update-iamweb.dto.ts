import { PartialType } from '@nestjs/swagger';
import { CreateIamwebDto } from './create-iamweb.dto';

export class UpdateIamwebDto extends PartialType(CreateIamwebDto) {}
