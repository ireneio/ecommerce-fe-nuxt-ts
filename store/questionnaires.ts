import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'questionnaires',
  stateFactory: true,
  namespaced: true
})
export default class QuestionnairesModule extends VuexModule {
  public questionnairesList: any = []
  public questionnairesDetail: any = []

  @Mutation
  setQuestionnairesList(payload: any) {
    this.questionnairesList = payload
  }

  @Mutation
  setQuestionnairesDetail(payload: any) {
    this.questionnairesDetail = payload
  }

  @Action({ commit: 'setQuestionnairesList' })
  async getQuestionnairesList({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Questionnaire/List',
      key: process.env.apiKey,
      data: {},
      method: 'post',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      default:
        return null
    }
  }

  @Action({ commit: 'setQuestionnairesDetail' })
  async getQuestionnairesDetail({ serialno, token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Questionnaire/Get',
      key: process.env.apiKey,
      data: { questionnaireId: serialno },
      method: 'post',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 400:
        throw new Error('Not found')
      default:
        return null
    }
  }
}
