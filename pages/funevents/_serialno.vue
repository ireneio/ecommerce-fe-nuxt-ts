<template>
  <div>
    <DefaultMainContainer
      title="返回瘋活動"
      :clickableTitle="true"
      route="funevents"
      :dark="currentTab !== 0"
    >
      <div class="funEventsDetail" v-show="currentTab === 0">
        <div class="funEventsDetailHeader">
          <div class="funEventsDetailHeader__carousel">
            <client-only>
              <VueSlickCarousel v-bind="carouselSetting">
                <div
                  class="cardBox funEventsDetailHeader__img"
                  v-if="!eventImages.length"
                ></div>
                <div
                  class="cardBox funEventsDetailHeader__img"
                  :style="{ 'background-image': `url(${img.imageName})` }"
                  v-for="img in eventImages"
                  :key="img.serialno"
                ></div>
                <template #prevArrow>
                  <div class="carouselArrowLeft"></div>
                </template>
                <template #nextArrow>
                  <div class="carouselArrowRight"></div>
                </template>
              </VueSlickCarousel>
            </client-only>
          </div>
          <div class="funEventsDetailHeader__text">
            <h3 class="funEventsDetailHeader__title">
              {{ eventInfo.activeName }}
            </h3>
            <p class="funEventsDetailHeader__subtitle">
              {{ eventInfo.activeShortDescription }}
            </p>
            <p class="funEventsDetailHeader__subtext">
              <fa
                :icon="['far', 'clock']"
                class="funEventsDetailHeader__icon"
              ></fa>
              <span
                >活動時間：{{
                  `${new Date(
                    eventInfo.activeBegindate
                  ).toLocaleString()} ~ ${new Date(
                    eventInfo.activeEnddate
                  ).toLocaleString()}`
                }}</span
              >
            </p>
            <p class="funEventsDetailHeader__subtext">
              <fa
                :icon="['fas', 'map-marker-alt']"
                class="funEventsDetailHeader__icon"
              ></fa>
              <span>活動地點：{{ eventInfo.activePlace }}</span>
            </p>
            <p class="funEventsDetailHeader__subtext">
              <span class="ml-5">活動地址：{{ eventInfo.activeAddr }}</span>
            </p>
            <p class="funEventsDetailHeader__subtext">
              <fa
                :icon="['fas', 'globe']"
                class="funEventsDetailHeader__icon"
              ></fa>
              <span>主辦單位：{{ eventInfo.activeHost }}</span>
            </p>
            <p class="funEventsDetailHeader__subtext">
              <span class="ml-5">
                協辦單位：{{ eventInfo.activeCoOrganized }}
              </span>
            </p>
            <div class="funEventsDetailHeader__btn">
              <BaseButton
                :type="eventInfo.ButtonText === '' ? 'primary' : 'greyTwo'"
                @click="handleApply"
                :disabled="eventInfo.ButtonText !== ''"
                >{{
                  eventInfo.ButtonText === ''
                    ? '立即報名'
                    : eventInfo.ButtonText
                }}
              </BaseButton>
            </div>
            <div class="funEventsDetailHeader__alertbox">
              <div
                class="funEventsDetailHeader__alert"
                v-if="eventInfo.hasToVerify"
              >
                <fa :icon="['fas', 'exclamation-circle']"></fa>

                <span>報名完成後須等候主辦單位審查，核准後才算報名成功。</span>
              </div>
              <div
                class="funEventsDetailHeader__alert"
                v-if="eventInfo.isEnableWaitingList"
              >
                <fa :icon="['fas', 'exclamation-circle']"></fa>
                <span>
                  活動名額有限，請盡快報名，進入備取名單後請靜候主辦單位通知遞補結果。
                </span>
              </div>
            </div>
          </div>
        </div>
        <section class="funEventsDetailSection">
          <h4 class="funEventsDetailSection__title">活動描述</h4>
          <div class="funEventsDetailSection__body">
            <article
              class="funEventsDetailSection__bodytext"
              v-html="eventDescription"
            ></article>
          </div>
        </section>
        <section class="funEventsDetailSection">
          <h4 class="funEventsDetailSection__title">票價資訊</h4>
          <div class="funEventsDetailSection__body">
            <client-only>
              <vue-good-table :columns="tableFields" :rows="eventCouponList">
                <div slot="emptystate">
                  This will show up when there are no rows
                </div>
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'couponAvailableDate'">
                    <div class="funEventsTable__tableRow">
                      <div class="funEventsTable__couponDate">
                        {{
                          `${props.row.couponBegindate} ~ ${props.row.couponEnddate}`
                        }}
                      </div>
                    </div>
                  </span>
                  <span v-if="props.column.field == 'couponStatus'">
                    <div class="funEventsTable__tableRow">
                      {{ props.row.couponStatus }}
                    </div>
                  </span>
                  <span v-if="props.column.field == 'couponName'">
                    <div class="funEventsTable__tableRow">
                      <div class="funEventsTable__couponName">
                        {{ props.row.couponName }}
                      </div>
                    </div>
                  </span>
                  <span v-if="props.column.field == 'couponPrice'">
                    <div class="funEventsTable__tableRow">
                      {{ props.row.couponPrice }}
                    </div>
                  </span>
                </template>

                <template slot="table-column" slot-scope="props">
                  <div class="funEventsTable__label">
                    {{ props.column.label }}
                  </div>
                </template>
              </vue-good-table>
            </client-only>
          </div>
          <div class="funEventsDetailSection__btn">
            <BaseButton
              :type="eventInfo.ButtonText === '' ? 'primary' : 'greyTwo'"
              @click="handleApply"
              :disabled="eventInfo.ButtonText !== ''"
              >{{
                eventInfo.ButtonText === '' ? '立即報名' : eventInfo.ButtonText
              }}
            </BaseButton>
          </div>
        </section>
      </div>
      <div class="funEventsDetail" v-show="currentTab !== 0">
        <div class="funEventsCheckoutHeader__alertbox" v-show="currentTab >= 2">
          <p class="funEventsCheckoutHeader__alert">
            貼心提醒 : 點選下一步後， 需於15分內完成報名
            {{ `${Math.floor(timer / 60)}:${Math.ceil(timer % 60)}` }}
          </p>
        </div>
        <div class="funEventsCheckoutHeader">
          <h3 class="funEventsCheckoutHeader__title">活動結帳流程</h3>
          <div class="funEventsCheckoutHeader__steps">
            <BaseSelect
              v-model="currentTab"
              :options="tabs"
              :selectable="
                (option) => {
                  if (
                    isFilled.includes(option.value) ||
                    option.value - 1 === isFilled[isFilled.length - 1]
                  ) {
                    return option
                  }
                }
              "
              :valid="true"
            />
          </div>
          <div class="funEventsCheckoutBody">
            <h4 class="funEventsCheckoutBody__title">
              {{ eventInfo.activeName }}
            </h4>
            <div class="funEventsCheckout__subtitlebox">
              <p class="funEventsDetailHeader__subtext">
                <fa
                  :icon="['far', 'clock']"
                  class="funEventsDetailHeader__icon"
                ></fa>
                <span
                  >活動時間：{{
                    `${new Date(
                      eventInfo.activeBegindate
                    ).toLocaleString()} ~ ${new Date(
                      eventInfo.activeEnddate
                    ).toLocaleString()}`
                  }}</span
                >
              </p>
              <p class="funEventsDetailHeader__subtext">
                <fa
                  :icon="['fas', 'map-marker-alt']"
                  class="funEventsDetailHeader__icon"
                ></fa>
                <span>活動地點：{{ eventInfo.activePlace }}</span>
              </p>
            </div>
            <div
              class="funEventsCheckoutStepOne__body"
              v-show="currentTab === 1"
            >
              <client-only>
                <vue-good-table
                  :columns="checkoutTableFields"
                  :rows="eventCouponList"
                  :sort-options="{
                    enabled: false
                  }"
                >
                  <div slot="emptystate">
                    This will show up when there are no rows
                  </div>
                  <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'couponName'">
                      <div
                        class="funEventsTable__tableRow funEventsTable__couponTitle"
                        :class="{
                          'funEventsTable__tableRow--disabled':
                            props.row.couponStatus !== '販售中' &&
                            props.row.remainingTicket <= 0
                        }"
                      >
                        <div
                          class="funEventsTable__couponName"
                          :class="{
                            'funEventsTable__tableRow--disabled':
                              props.row.couponStatus !== '販售中' &&
                              props.row.remainingTicket <= 0
                          }"
                        >
                          <div>{{ props.row.couponName }}</div>
                          <div>
                            販售時間：{{
                              `${props.row.couponBegindate} ~ ${props.row.couponEnddate}`
                            }}
                          </div>
                        </div>
                      </div>
                    </span>
                    <span v-if="props.column.field == 'couponQuantity'">
                      <div
                        class="funEventsTable__tableRow funEventsTable__couponQty"
                        :class="{
                          'funEventsTable__tableRow--disabled':
                            props.row.couponStatus !== '販售中' &&
                            props.row.remainingTicket <= 0
                        }"
                      >
                        <div class="funEventsTable__quantitySelector">
                          <button
                            class="funEventsTable__quantityBtn"
                            :class="{
                              'funEventsTable__quantityBtn--disabled':
                                props.row.couponStatus !== '販售中' &&
                                props.row.remainingTicket <= 0
                            }"
                            :disabled="
                              (props.row.couponStatus !== '販售中' &&
                                props.row.remainingTicket <= 0) ||
                              couponOrder[
                                eventCouponList.findIndex(
                                  (item) =>
                                    item.couponName === props.row.couponName
                                )
                              ] === 0
                            "
                            @click="
                              handleOrderDecrement(
                                eventCouponList.findIndex(
                                  (item) =>
                                    item.couponName === props.row.couponName
                                )
                              )
                            "
                          >
                            -
                          </button>
                          <span class="funEventsTable__quantityText">
                            <label :for="'inc' + props.row.couponName">
                              {{
                                couponOrder[
                                  eventCouponList.findIndex(
                                    (item) =>
                                      item.couponName === props.row.couponName
                                  )
                                ]
                              }}
                              <input
                                :id="'inc' + props.row.couponName"
                                type="number"
                                v-model="
                                  couponOrder[
                                    eventCouponList.findIndex(
                                      (item) =>
                                        item.couponName === props.row.couponName
                                    )
                                  ]
                                "
                                min="0"
                                :max="eventInfo.couponOrderCount"
                                :disabled="
                                  props.row.couponStatus !== '販售中' &&
                                  props.row.remainingTicket <= 0
                                "
                                :class="{
                                  'funEventsTable__tableRow--disabled':
                                    props.row.couponStatus !== '販售中' &&
                                    props.row.remainingTicket <= 0
                                }"
                              />
                            </label>
                          </span>
                          <button
                            class="funEventsTable__quantityBtn"
                            :class="{
                              'funEventsTable__quantityBtn--disabled':
                                props.row.couponStatus !== '販售中' &&
                                props.row.remainingTicket <= 0
                            }"
                            :disabled="
                              (props.row.couponStatus !== '販售中' &&
                                props.row.remainingTicket <= 0) ||
                              couponOrder[
                                eventCouponList.findIndex(
                                  (item) =>
                                    item.couponName === props.row.couponName
                                )
                              ] === eventInfo.couponOrderCount
                            "
                            @click="
                              handleOrderIncrement(
                                eventCouponList.findIndex(
                                  (item) =>
                                    item.couponName === props.row.couponName
                                )
                              )
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </span>
                    <span v-if="props.column.field == 'couponPrice'">
                      <div
                        class="funEventsTable__tableRow funEventsTable__couponPrice"
                        :class="{
                          'funEventsTable__tableRow--disabled':
                            props.row.couponStatus !== '販售中' &&
                            props.row.remainingTicket <= 0
                        }"
                      >
                        ${{
                          (
                            Number(
                              couponOrder[
                                eventCouponList.findIndex(
                                  (item) =>
                                    item.couponName === props.row.couponName
                                )
                              ]
                            ) *
                            Number(props.row.couponPrice.split(',').join(''))
                          ).toLocaleString('en')
                        }}
                      </div>
                    </span>
                  </template>

                  <template slot="table-column" slot-scope="props">
                    <div class="funEventsTable__label">
                      {{ props.column.label }}
                    </div>
                  </template>
                </vue-good-table>
              </client-only>
              <div class="funEventsCheckoutBody__box">
                <BaseCheckbox
                  v-model="agreePrivacy"
                  id="agreePrivacy1"
                  :value="agreePrivacy"
                  >同意STAYFUN
                  <a
                    href="/privacy"
                    class="funEventsCheckoutBody__box__link"
                    target="_blank"
                    >隱私權條款
                  </a>
                </BaseCheckbox>
                <BaseCheckbox
                  v-model="agreePrivacy2"
                  id="agreePrivacy2"
                  :value="agreePrivacy2"
                  v-if="eventInfo.activePsTitle"
                  >同意
                  <a
                    href="/privacy"
                    class="funEventsCheckoutBody__box__link"
                    target="_blank"
                    >活動報名條款
                  </a>
                </BaseCheckbox>
              </div>
            </div>
            <div
              class="funEventsCheckoutStepTwo__body"
              v-show="currentTab === 2"
            >
              <div class="funEventsCheckoutStepTwo__inputbox">
                <ValidationObserver>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="max:50|required"
                  >
                    <BaseLabel
                      text="姓名"
                      required
                      :valid="!errors.length"
                      :hint="{
                        text: errors.length ? errors[0] : '',
                        type: 'warning'
                      }"
                    >
                      <BaseInput
                        v-model="form.name"
                        @blur="initialzied = true"
                        :valid="!errors.length"
                      />
                    </BaseLabel>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="max:50|required"
                  >
                    <BaseLabel
                      text="聯絡電話"
                      required
                      :valid="!errors.length"
                      :hint="{
                        text: errors.length ? errors[0] : '',
                        type: 'warning'
                      }"
                    >
                      <BaseInput
                        v-model="form.phone"
                        @blur="initialzied = true"
                        :valid="!errors.length"
                      />
                    </BaseLabel>
                  </ValidationProvider>
                </ValidationObserver>
              </div>
              <div class="funEventsCheckoutStepTwo__subtotalbox">
                <div
                  class="funEventsCheckoutStepTwo__subtotalitem"
                  v-for="(item, i) in couponOrder"
                  v-show="item > 0"
                  :key="i"
                >
                  <div class="funEventsCheckoutStepTwo__subtotalitemtitle">
                    {{
                      eventCouponList.find((item, index) => index === i)
                        .couponName
                    }}
                  </div>
                  <div class="funEventsCheckoutStepTwo__subtotalitemcontent">
                    <div>
                      <span>x {{ item }}</span>
                    </div>
                    <div>
                      <span>
                        ${{
                          (
                            Number(item) *
                            Number(
                              eventCouponList
                                .find((item, index) => index === i)
                                .couponPrice.split(',')
                                .join('')
                            )
                          ).toLocaleString('en')
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="funEventsCheckoutStepTwo__subtotalqty">
                  <span>金額小計 : </span>
                  <span>
                    ${{
                      eventCouponList
                        .reduce(
                          (prev, curr, index) =>
                            (prev +=
                              Number(
                                couponOrder.find((item, i) => i === index)
                              ) * Number(curr.couponPrice.split(',').join(''))),
                          0
                        )
                        .toLocaleString('en')
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div
              class="funEventsCheckoutStepThree__body"
              v-show="currentTab === 3"
            >
              <div class="funEventsCheckoutStepThree__inputbox">
                <ValidationObserver>
                  <div v-for="(item, index) in formDataDetail" :key="index">
                    <div class="funEventsCheckoutStepThree__inputGroup">
                      <h5 class="funEventsCheckoutStepThree__inputTitle">
                        票券名稱:
                        {{ item.couponName }}
                      </h5>
                      <div
                        class="funEventsCheckoutStepThree__input"
                        v-for="(value, key) in item"
                        :key="key"
                        v-show="key !== 'couponName'"
                      >
                        <div v-if="key === 'contactaddress'">
                          <ValidationProvider
                            v-slot="{ errors }"
                            rules="required"
                          >
                            <BaseLabel
                              :text="formList[key] ? formList[key].label : ''"
                              :valid="!errors.length"
                              :hint="{
                                text: errors.length ? errors[0] : '',
                                type: 'warning'
                              }"
                            >
                              <BaseSelect
                                :options="areaList"
                                @input="formData[index][key].areaId = $event"
                                :value="formData[index][key].areaId"
                                :valid="!errors.length"
                              />
                              <BaseSelect
                                :options="areaList"
                                @input="formData[index][key].countyId = $event"
                                :value="formData[index][key].countyId"
                                :valid="!errors.length"
                              />
                              <BaseInput
                                type="text"
                                @input="formData[index][key].address = $event"
                                :value="formData[index][key].address"
                                max="50"
                                min="0"
                                :valid="!errors.length"
                              />
                            </BaseLabel>
                          </ValidationProvider>
                        </div>
                        <ValidationProvider
                          v-slot="{ errors }"
                          :rules="`max:50${
                            key.details
                              ? key.details.isRequired
                                ? '|required'
                                : ''
                              : ''
                          }`"
                          v-if="
                            key !== 'couponName' && key !== 'contactaddress'
                          "
                        >
                          <BaseLabel
                            :text="formList[key] ? formList[key].label : ''"
                            :valid="!errors.length"
                            :hint="{
                              text: errors.length ? errors[0] : '',
                              type: 'warning'
                            }"
                          >
                            {{ index }}
                            <BaseInput
                              :id="index.toString()"
                              :type="formList[key] ? formList[key].type : ''"
                              v-if="
                                formList[key] &&
                                (formList[key].type === 'text' ||
                                  formList[key].type === 'number')
                              "
                              @input="formData[index][key] = $event"
                              :value="formData[index][key]"
                              :max="
                                formList[key] &&
                                formList[key].label === 'departmentHeadCount'
                                  ? '5'
                                  : '50'
                              "
                              :min="
                                formList[key] && formList[key].type === 'number'
                                  ? '1'
                                  : null
                              "
                              :valid="!errors.length"
                            />
                            <BaseDatepicker
                              type="date"
                              v-if="
                                formList[key] && formList[key].type === 'date'
                              "
                              :valid="!errors.length"
                              @input="formData[index][key] = $event"
                              :value="formData[index][key]"
                            />
                            <b-form-radio-group
                              :id="`${formList[key].label}+${index}`"
                              @input="formData[index][key] = $event"
                              :value="formData[index][key]"
                              :name="`${formList[key].label}+${index}`"
                              v-if="
                                formList[key] && formList[key].type === 'radio'
                              "
                            >
                              <template
                                v-if="
                                  item[key].details &&
                                  item[key].details.radioList
                                "
                              >
                                <b-form-radio
                                  :value="item.columnValue"
                                  v-for="(item, j) in item[key].details
                                    .radioList"
                                  :key="j"
                                >
                                  {{ item.columnText }}
                                </b-form-radio>
                              </template>
                            </b-form-radio-group>
                          </BaseLabel>
                        </ValidationProvider>
                      </div>
                    </div>
                  </div>
                </ValidationObserver>
              </div>
              <div class="funEventsCheckoutStepTwo__subtotalbox">
                <div
                  class="funEventsCheckoutStepTwo__subtotalitem"
                  v-for="(item, i) in couponOrder"
                  v-show="item > 0"
                  :key="i"
                >
                  <div class="funEventsCheckoutStepTwo__subtotalitemtitle">
                    {{
                      eventCouponList.find((item, index) => index === i)
                        .couponName
                    }}
                  </div>
                  <div class="funEventsCheckoutStepTwo__subtotalitemcontent">
                    <div>
                      <span>x {{ item }}</span>
                    </div>
                    <div>
                      <span>
                        ${{
                          (
                            Number(item) *
                            Number(
                              eventCouponList
                                .find((item, index) => index === i)
                                .couponPrice.split(',')
                                .join('')
                            )
                          ).toLocaleString('en')
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="funEventsCheckoutStepTwo__subtotalqty">
                  <span>金額小計 : </span>
                  <span>
                    ${{
                      eventCouponList
                        .reduce(
                          (prev, curr, index) =>
                            (prev +=
                              Number(
                                couponOrder.find((item, i) => i === index)
                              ) * Number(curr.couponPrice.split(',').join(''))),
                          0
                        )
                        .toLocaleString('en')
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div
              class="funEventsCheckoutStepFour__body"
              v-show="currentTab === 4"
            >
              <div class="funEventsCheckoutStepFour__table"></div>
              <div class="funEventsCheckoutStepFour__paymentType">
                付款方式: <span></span>
              </div>
              <div class="funEventsCheckoutStepFour__paymentForm"></div>
            </div>
            <div class="funEventsCheckout__btnbox">
              <BaseButton
                type="greyTwoOutline"
                @click="currentTab = 0"
                class="funEventsCheckout__btn"
                >取消
              </BaseButton>
              <BaseButton
                type="greyTwo"
                v-show="currentTab > 1"
                @click="currentTab -= 1"
                class="funEventsCheckout__btn"
                >上一步
              </BaseButton>
              <BaseButton
                type="greyTwo"
                v-show="currentTab < 4"
                @click="handleVerifyTab(currentTab)"
                class="funEventsCheckout__btn"
                >下一步
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </DefaultMainContainer>
    <DefaultDialog
      :active="dialogState"
      @cancel="handleDialogClose"
      @accept="handleDialogClose"
      @confirm="handleDialogConfirm"
      :message="dialogContent.message"
      :title="dialogContent.title"
      :type="dialogContent.type"
      :icon="dialogContent.icon"
    ></DefaultDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import VueSlickCarousel from 'vue-slick-carousel'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseSelect from '~/components/BaseSelect.vue'
import BaseCheckbox from '~/components/BaseCheckbox.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseDatepicker from '~/components/BaseDatepicker.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import { funEventsStore, dialogStore, commonStore } from '~/store'

interface TableData {
  couponPrice: string
  couponBegindate: string
  couponEnddate: string
  couponName: string
  couponStatus: string
}

interface CheckoutTableData {
  couponPrice: string
  couponName: string
  couponQuantity: string
}

interface TableField {
  label: string
  field: string
  class?: string
  thClass?: string
  dateInputFormat?: string
  dateOutputFormat?: string
  type?: string
}

@Component({
  middleware: 'auth',
  components: {
    DefaultMainContainer,
    BaseButton,
    VueSlickCarousel,
    DefaultDialog,
    BaseSelect,
    BaseCheckbox,
    BaseDatepicker,
    BaseInput,
    ValidationObserver,
    ValidationProvider
  }
})
export default class FunEventsDetail extends Vue {
  public formList: any = {
    accountname: { label: '姓名', type: 'text' },
    accountid: { label: '工號', type: 'text' },
    mobilephone: { label: '手機號碼', type: 'text' },
    contactPhone: { label: '連絡電話', type: 'text' },
    emailaddress: { label: 'E-mail', type: 'text' },
    contactaddress: { label: '地址', type: 'selectAddress' },
    birthday: { label: '生日', type: 'date' },
    personalid: { label: '證號', type: 'text' },
    arrivalDate: { label: '期望到貨日', type: 'date' },
    definitionID: { label: '帳號後五碼', type: 'text' },
    invoiceTaxId: { label: '發票統一編號', type: 'text' },
    department: { label: '部門名稱', type: 'text' },
    departmentCode: { label: '部門代碼', type: 'text' },
    departmentHeadCount: { label: '部門人數', type: 'number' },
    gender: { label: '性別', type: 'radio' },
    clothSize: { label: '衣服尺寸', type: 'text' },
    dietaryPreference: { label: '飲食偏好', type: 'radio' }
  }

  public initialzied: boolean = false

  public form: any = {
    phone: '',
    name: ''
  }

  public timer: number = 0

  public formDataDetail: any = []

  public formData: any = []

  public formCreated: boolean = false

  public getFormData() {
    let obj: any = {}
    let res: any = []
    for (let i = 0; i < this.couponOrder.length; i++) {
      if (this.couponOrder[i] > 0) {
        for (let j = 0; j < Array(this.couponOrder[i]).length; j++) {
          let arr: any = this.eventCouponList.find(
            // /^_/u @typescript-eslint/no-unused-vars
            (listitem: any, indexK) => indexK === i
          ).columnStatusList
          const name: any = this.eventCouponList.find(
            // /^_/u @typescript-eslint/no-unused-vars
            (listitem: any, indexK) => indexK === i
          ).couponName
          if (arr) {
            arr = [...arr].sort((a, b) => a.sequence - b.sequence)
          }
          for (let k = 0; k < arr.length; k++) {
            const inputName = arr[k].columnName
            obj = { ...obj, [inputName]: { value: '', details: arr[k] } }
          }
          res = [...res, { ...obj, couponName: name }]
        }
      }
    }
    return res
  }

  @Watch('currentTab')
  onTabUpdate(newVal: number) {
    // dynamically generate form
    if (newVal === 3 && !this.formCreated) {
      const form = this.getFormData()
      console.log(form)
      this.formData = Array(form.length).fill({})
      this.formDataDetail = Array(form.length).fill({})
      form.forEach((item: any, index: number) => {
        Object.keys(item).forEach((key: any) => {
          if (key !== 'couponName' && key !== 'contactaddress') {
            this.$set(this.formData[index], key, '')
            this.$set(this.formDataDetail[index], key, {})
            this.$set(this.formDataDetail[index][key], 'value', '')
            this.$set(
              this.formDataDetail[index][key],
              'details',
              item[key].details
            )
          } else if (key === 'contactaddress') {
            this.$set(this.formData[index], key, {
              // areaId: '',
              // countyId: '',
              // address: ''
            })
            this.$set(this.formData[index][key], 'areaId', '')
            this.$set(this.formData[index][key], 'countyId', '')
            this.$set(this.formData[index][key], 'address', '')
            this.$set(this.formDataDetail[index], key, {})
            this.$set(this.formDataDetail[index][key], 'value', '')
            this.$set(
              this.formDataDetail[index][key],
              'details',
              item[key].details
            )
          } else {
            this.$set(this.formDataDetail[index], key, item[key])
          }
        })
      })
      this.formCreated = true
    }
    if (newVal === 2 && !this.initialzied) {
      this.timer = 15 * 60
      this.interval = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1
        } else {
          clearTimeout(this.interval)
          this.currentTab = 0
        }
      }, 1000)
    }
  }

  @Watch('formData', { deep: true })
  onValueChange(newVal: any) {
    newVal.forEach(async (item: any, index: number) => {
      const areaName = this.areaList
        .filter((areaObj: any) => {
          if (areaObj.value === item.contactaddress.areaId) return areaObj
        })
        .map((areaObj: any) => areaObj.label)[0]
      await this.sendGetCountyRequest(areaName, index)
    })
  }

  get areaList() {
    return commonStore.areaList.length
      ? commonStore.areaList.map((item: any) => ({
          label: item.area,
          value: item.areaId
        }))
      : []
  }

  get countyList() {
    return commonStore.countyList.length
      ? commonStore.countyList.map((item: any) => ({
          label: item.area,
          value: item.areaId
        }))
      : []
  }

  public handleVerifyTab(currentTab: number): void {
    if (currentTab === 1) {
      if (!this.tabOneVerification()) {
        return
      }
    }
    if (currentTab === 2) {
      if (!this.tabTwoVerification()) {
        return
      }
    }
    if (currentTab === 3) {
      if (!this.tabThreeVerification()) {
        return
      }
    }
    if (!this.isFilled.includes(this.currentTab)) {
      this.isFilled = [...this.isFilled, this.currentTab]
    }
    this.currentTab += 1
  }

  public tabOneVerification(): boolean {
    if (this.couponOrder.filter((item: any) => item > 0).length === 0) {
      dialogStore.setContent({
        title: '請注意',
        type: 'accept',
        message: '請選擇票種'
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
      return false
    } else if (!this.agreePrivacy) {
      dialogStore.setContent({
        title: '請注意',
        type: 'accept',
        message: '請同意 STAYFUN 隱私權條款'
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
      return false
    } else if (this.eventInfo.activePsTitle && !this.agreePrivacy2) {
      dialogStore.setContent({
        title: '請注意',
        type: 'accept',
        message: '請同意 STAYFUN 活動報名條款'
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
      return false
    }
    return true
  }

  public tabTwoVerification(): boolean {
    this.initialzied = true
    if (this.form.phone === '' || this.form.name === '') {
      return false
    }
    return true
  }

  public tabThreeVerification(): boolean {
    this.formData.forEach((item: any, i: number) => {
      Object.keys(item).forEach((key) => {
        if (
          this.formDataDetail[i][key].details.isRequired &&
          !this.formData[i][key]
        ) {
          return false
        }
      })
    })
    return true
  }

  public currentTab: number = 0

  public tabs: Array<any> = [
    { label: '1 選擇票種', value: 1 },
    { label: '2 會員資料', value: 2 },
    { label: '3 填寫表單', value: 3 },
    { label: '4 付款', value: 4 }
  ]

  public isFilled: Array<number> = []

  public handleApply(): void {
    if (this.eventInfo.hasToAlert) {
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
      dialogStore.setContent({
        type: 'confirm',
        icon: true,
        title: '請注意',
        message: this.alertText,
        initializer: 'funevents-serialno-confirmTab'
      })
    } else {
      this.currentTab = 1
    }
  }

  public handleDialogConfirm() {
    if (dialogStore.content.initializer === 'funevents-serialno-confirmTab') {
      dialogStore.setMaskActive(false)
      dialogStore.setActive(false)
      this.currentTab = 1
    }
  }

  public handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public tableFields: Array<TableField> = [
    { label: '票種', field: 'couponName' },
    { label: '販售時間', field: 'couponAvailableDate' },
    { label: '狀態', field: 'couponStatus' },
    { label: '票價($)', field: 'couponPrice' }
  ]

  public carouselSetting: any = {
    dots: false,
    edgeFriction: 0.35,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  }

  get eventCouponList(): Array<any> {
    return Object.keys(funEventsStore.eventDetail).length
      ? funEventsStore.eventDetail.FunActivityCoupons.map((item: any) => ({
          ...item,
          couponBegindate: new Date(item.couponBegindate).toLocaleString(),
          couponEnddate: new Date(item.couponEnddate).toLocaleString(),
          couponPrice: item.couponPrice.toLocaleString('en'),
          couponStatus: this.eventStatus(
            item.couponBegindate,
            item.couponEnddate
          )
        }))
      : []
  }

  public couponOrder: Array<number> = []

  public checkoutTableFields: Array<TableField> = [
    { label: '票種名稱', field: 'couponName' },
    { label: '數量', field: 'couponQuantity' },
    { label: '小計', field: 'couponPrice' }
  ]

  @Watch('eventCouponList', { deep: true })
  onPropertyChange(newVal: Array<TableData>) {
    const res = Array(newVal.length).fill(0)
    this.couponOrder = res
  }

  public handleOrderDecrement(index: number): void {
    if (this.couponOrder[index] > 0) {
      const res: Array<number> = this.couponOrder.map((item, i) => {
        if (i === index) {
          const num = Number(item) - 1
          item = num
          return item
        } else {
          return item
        }
      })
      this.couponOrder = res
    }
  }

  public handleOrderIncrement(index: number): void {
    const res: Array<number> = this.couponOrder.map((item, i) => {
      if (i === index) {
        const num = Number(item) + 1
        item = num
        return item
      } else {
        return item
      }
    })
    this.couponOrder = res
  }

  public agreePrivacy: boolean = false

  public agreePrivacy2: boolean = false

  public eventStatus(s: string, e: string) {
    const today = new Date()
    const startDate = new Date(s)
    const endDate = new Date(e)
    if (today > startDate && today < endDate) {
      return '販售中'
    } else if (today < startDate) {
      return '尚未開賣'
    } else if (today > endDate) {
      return '已結束'
    }
  }

  get alertText(): string {
    return Object.keys(funEventsStore.eventDetail).length
      ? funEventsStore.eventDetail.FunActivity[0].alertContent
      : ''
  }

  get eventInfo() {
    return Object.keys(funEventsStore.eventDetail).length
      ? funEventsStore.eventDetail.FunActivity[0]
      : {}
  }

  get eventDescription() {
    return Object.keys(funEventsStore.eventDetail).length
      ? funEventsStore.eventDetail.description
      : ''
  }

  get eventImages() {
    return Object.keys(funEventsStore.eventDetail).length
      ? funEventsStore.eventDetail.FunActivityImages.slice().sort(
          (a: any, b: any) => a.sortNum - b.sortNum
        )
      : []
  }

  public async sendGetEventDetailRequest() {
    try {
      await funEventsStore.getEventDetail({
        token: this.$cookies.get('accessToken'),
        serialno: this.$route.params.serialno
      })
    } catch (e) {
      // error
    }
  }

  public async sendGetAddressMenuRequest() {
    try {
      await commonStore.getArea({ token: this.$cookies.get('accessToken') })
    } catch (e) {
      // error
    }
  }

  public async sendGetCountyRequest(areaName: string, index: number) {
    try {
      await commonStore.getCounty({
        token: this.$cookies.get('accessToken'),
        areaName,
        index
      })
    } catch (e) {
      // error
    }
  }

  public async fetch() {
    await this.sendGetEventDetailRequest()
  }

  public activated() {
    this.currentTab = 0
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetEventDetailRequest()
      await this.sendGetAddressMenuRequest()
      this.$nuxt.$loading.finish()
    })
  }

  public interval: any = null

  public beforeDestroyed() {
    clearTimeout(this.interval)
    this.formCreated = false
    this.initialzied = false
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';
@import '../../assets/scss/utils/media';

.funEventsDetailHeader {
  display: flex;
  flex-wrap: wrap;
  &__carousel {
    flex: 0 0 100%;
    margin-bottom: $spacing-m;
    @include grid-lg {
      flex: 0 0 30%;
    }
    @include grid-xl {
      margin-bottom: 0;
    }
  }
  &__img {
    width: 70vw;
    height: 300px;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  &__text {
    flex: 0 0 100%;
    @include grid-lg {
      flex: 0 0 calc(65% - 50px);
      padding-left: 50px;
    }
  }
  &__title {
    font-weight: bold;
    color: $greyThree;
    font-size: $fz-xxl;
    margin-bottom: $spacing-m;
  }
  &__subtitle {
    font-size: $fz-s;
    color: $greyThree;
    margin-bottom: $spacing-l;
    font-weight: bold;
  }
  &__subtext {
    margin-bottom: $spacing-m;
    > span {
      margin-left: $spacing-xs;
    }
  }
  &__icon {
    font-size: $fz-m;
    color: $primary;
    width: 17px;
    height: 17px;
  }
  &__btn {
    margin-top: $spacing-xxl;
  }
  &__alert {
    color: $orangeDark;
    padding: $spacing-m 0;
    > span {
      margin-left: $spacing-xs;
    }
  }
}
.funEventsDetailSection {
  margin-top: $spacing-xxl;
  &__title {
    font-weight: bold;
    color: $greyThree;
    font-size: $fz-xxl;
    padding-bottom: $spacing-m;
    border-bottom: 1px solid $orange;
    margin-bottom: $spacing-xl;
  }
  &__body {
  }
  &__bodytext {
    max-height: 300px;
    overflow: auto;
  }
  &__btn {
    display: flex;
    justify-content: center;
    margin-top: $spacing-xxl;
  }
}
.cardBox {
  position: relative;
  padding: 0 $spacing-xs;
  max-width: 100%;
  @include grid-md {
    padding: 0 $spacing-s;
  }
  &__arrowLeft {
    left: -17px;
    background: url(/img/icon_lwft.svg);
    &:hover {
      background: url(/img/icon_lwft.svg);
    }
    &:before {
      content: '';
    }
  }
  &__arrowRight {
    right: -17px;
    background: url(/img/icon_right.svg);
    &:hover {
      background: url(/img/icon_right.svg);
    }
    &:before {
      content: '';
    }
  }
  &__arrowLeft,
  &__arrowRight {
    z-index: 10;
    width: 24px;
    height: 36px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.funEventsTable {
  &__tableRow {
    font-size: $fz-s;
    color: $greyThree;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: auto;
    text-overflow: ellipsis;
    &--disabled {
      color: $whiteOne;
    }
  }
  &__couponName {
    // max-width: 300px;
    // width: 300px;
    width: 300px;
    > div {
      padding: $spacing-l 0;
    }
  }
  &__couponDate {
    width: 200px;
  }
  &__couponTitle {
  }
  &__couponPrice {
    width: 80px;
  }
  &__couponQty {
    width: 120px;
  }
  &__quantitySelector {
    display: flex;
  }
  &__quantityBtn {
    text-align: center;
    width: 30px;
    padding: $spacing-xs $spacing-s;
    border: 1px solid $greyOne;
    cursor: pointer;
    outline: none;
    background-color: #fff;
    &--disabled {
      cursor: not-allowed;
    }
  }
  &__quantityText {
    border-top: 1px solid $greyOne;
    border-bottom: 1px solid $greyOne;
    padding: $spacing-xs;
    &--disabled {
      > input {
        color: $whiteOne;
      }
    }
    input {
      display: none;
    }
    > label {
      width: 25px;
      text-align: center;
    }
  }
}
.funEventsCheckout {
  &__btnbox {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    margin-top: $spacing-xxl;
    @include grid-md {
      justify-content: space-around;
    }
  }
  &__btn {
    margin: $spacing-m;
  }
}
.funEventsCheckoutHeader {
  padding: $spacing-l;
  background-color: #fff;
  &__alertbox {
    background-color: $orangeLighter;
    color: $greyThree;
    padding: $spacing-m 0;
    text-align: center;
    font-size: $fz-m;
    font-weight: bold;
    margin-bottom: $spacing-l;
  }
  &__title {
    font-size: $fz-xxl;
    font-weight: bold;
    border-bottom: 1px solid $orangeDark;
    padding: $spacing-l 0;
  }
  &__steps {
    padding: $spacing-m 0;
    max-width: 300px;
  }
}
.funEventsCheckoutBody {
  padding: $spacing-xxl;
  &__title {
    font-size: $fz-l;
    margin-bottom: $spacing-m;
    font-weight: bold;
    text-align: center;
  }
  &__subtitle {
    text-align: center;
  }
  &__box {
    padding-top: 60px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color: $greyThree;
  }
  &__link {
    color: $orangeDark;
  }
}
.funEventsCheckoutStepTwo {
  &__body {
    display: flex;
    flex-wrap: wrap;
  }
  &__inputbox {
    flex: 0 0 100%;
    order: 2;
    padding-right: $spacing-xxl;
    margin-top: $spacing-l;
    > label {
      margin-bottom: $spacing-xxl;
    }
    @include grid-md {
      flex: 0 0 60%;
      order: -1;
      margin-top: 0;
    }
  }
  &__subtotalbox {
    flex: 0 0 100%;
    order: 0;
    border: 1px solid $whiteOne;
    border-radius: 4px;
    padding: $spacing-m;
    margin-top: $spacing-xxl;
    @include grid-md {
      flex: 0 0 40%;
      margin-top: 0;
    }
  }
  &__subtotalitem {
    text-align: left;
    padding: 0 $spacing-m;
  }
  &__subtotalitemtitle {
    font-weight: bold;
    font-size: $fz-s;
  }
  &__subtotalitemcontent {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: $fz-s;
    margin-top: $spacing-m;
    margin-bottom: $spacing-m;
  }
  &__subtotalqty {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: $fz-s;
    padding: $spacing-m;
    border-top: 2px solid $whiteOne;
    > span + span {
      color: $orangeDark;
    }
  }
}
.funEventsCheckoutStepThree {
  &__body {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  &__inputbox {
    flex: 0 0 100%;
    order: 2;
    margin-top: $spacing-l;
    padding-right: $spacing-xxl;
    @include grid-md {
      flex: 0 0 60%;
      order: -1;
      margin-top: 0;
    }
  }
  &__inputGroup {
    width: 100%;
  }
  &__inputTitle {
    font-size: $fz-s;
    border-bottom: 1px solid $primary;
    // padding-bottom: $spacing-s;
    margin-bottom: $spacing-s;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    text-align: left;
  }
}
</style>
