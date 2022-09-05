import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { deepParseJson } = require('deep-parse-json');
import * as _ from 'lodash';

type TParseFormDataJsonOptions = {
  except?: string[];
};

export class ParseFormDataJsonPipe implements PipeTransform {
  constructor(private options?: TParseFormDataJsonOptions) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const { except } = this.options;
    const serializedValue = value;
    const originProperties = {};
    if (except?.length) {
      _.merge(originProperties, _.pick(serializedValue, ...except));
    }
    const deserializedValue = deepParseJson(value);
    //console.log(`deserializedValue`, deserializedValue);
    return { ...deserializedValue, ...originProperties };
  }
}
