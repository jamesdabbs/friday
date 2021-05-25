import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService
  ) {}

  async getHello() {
    const domain = this.config.get('CONFLUENCE_DOMAIN')

    const response = await axios.get(
      `https://${domain}.atlassian.net/wiki/rest/api/space`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        auth: {
          username: this.config.get('CONFLUENCE_EMAIL'),
          password: this.config.get('CONFLUENCE_API_TOKEN')
        }
      }
    )

    return response.data;
  }
}
