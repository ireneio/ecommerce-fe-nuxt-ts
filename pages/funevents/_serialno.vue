<template>
  <div>
    <default-main-container
      title="返回瘋活動"
      :clickableTitle="true"
      route="funevents"
      :dark="currentTab !== 0"
    >
      <div class="funEventsDetail" v-show="currentTab === 0">
        <div class="funEventsDetailHeader">
          <div class="funEventsDetailHeader__carousel">
            <client-only>
              <vue-slick-carousel v-bind="carouselSetting">
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
              </vue-slick-carousel>
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
              <span>
                活動時間：{{
                  `${new Date(eventInfo.activeBegindate).toLocaleString(
                    'zh-TW',
                    {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }
                  )} ~ ${new Date(eventInfo.activeEnddate).toLocaleString(
                    'zh-TW',
                    {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }
                  )}`
                }}
              </span>
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
            <p class="funEventsDetailHeader__subtext">
              <fa
                :icon="['fas', 'user']"
                class="funEventsDetailHeader__icon"
              ></fa>
              <span>
                {{
                  totalSpots === null
                    ? '報名額度無上限'
                    : `報名額度上限 ${totalSpots} 人 / 剩餘 ${totalAvailableSpots} 人`
                }}
              </span>
            </p>
            <div class="funEventsDetailHeader__btn">
              <base-button
                :type="purchaseBtnStatus === '立即報名' ? 'primary' : 'greyOne'"
                @click="handleApply"
                :disabled="purchaseBtnStatus !== '立即報名'"
                >{{ purchaseBtnStatus }}</base-button
              >
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
                <span
                  >活動名額有限，請盡快報名，進入備取名單後請靜候主辦單位通知遞補結果。</span
                >
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
          <p
            class="funEventsDetailHeader__subtext"
            v-if="
              eventInfo.SalesCountLimit !== -2147483648 &&
              eventInfo.SalesCountLimit !== null
            "
          >
            <fa
              :icon="['fas', 'ticket-alt']"
              class="funEventsDetailHeader__icon"
            ></fa>
            <span>{{
              `票券數量上限 ${totalCoupons} 張 / 剩餘 ${totalAvailableCoupons} 張`
            }}</span>
          </p>
          <div class="funEventsDetailSection__body">
            <client-only>
              <vue-good-table
                :columns="tableFields"
                :rows="eventCouponList"
                :sort-options="{
                  enabled: false
                }"
              >
                <div slot="emptystate">無</div>
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'couponAvailableDate'">
                    <div class="funEventsTable__tableRow">
                      <div class="funEventsTable__couponDate">
                        {{
                          `${props.row.couponBegindate.toLocaleString('zh-TW', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} ~ ${props.row.couponEnddate.toLocaleString(
                            'zh-TW',
                            {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )}`
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
            <base-button
              :type="purchaseBtnStatus === '立即報名' ? 'primary' : 'greyOne'"
              @click="handleApply"
              :disabled="purchaseBtnStatus !== '立即報名'"
              >{{ purchaseBtnStatus }}</base-button
            >
          </div>
        </section>
      </div>
      <div class="funEventsDetail" v-show="currentTab !== 0">
        <div
          class="funEventsCheckoutHeader__alertbox"
          v-show="currentTab === 1"
        >
          <p class="funEventsCheckoutHeader__alert">
            貼心提醒 : 點選下一步後， 需於15分內完成報名
          </p>
        </div>
        <div class="funEventsCheckoutHeader__alertbox" v-show="currentTab >= 2">
          <p class="funEventsCheckoutHeader__alert">
            貼心提醒 : 此張訂單報名時間尚餘
            {{ ` ${Math.floor(timer / 60)}:${Math.ceil(timer % 60)}` }}
          </p>
        </div>
        <div class="funEventsCheckoutHeader">
          <h3 class="funEventsCheckoutHeader__title">活動結帳流程</h3>
          <!-- <div class="funEventsCheckoutHeader__steps">
            <BaseSelect
              v-model="currentTab"
              :options="tabs"
              :selectable="
                (option) => {
                  return tabAllowed(option.value)
                }
              "
              :valid="true"
            />
          </div>-->
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
                <span>
                  活動時間：{{
                    `${new Date(eventInfo.activeBegindate).toLocaleString(
                      'zh-TW',
                      {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )} ~ ${new Date(eventInfo.activeEnddate).toLocaleString(
                      'zh-TW',
                      {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}`
                  }}
                </span>
              </p>
              <p class="funEventsDetailHeader__subtext">
                <fa
                  :icon="['fas', 'map-marker-alt']"
                  class="funEventsDetailHeader__icon"
                ></fa>
                <span>活動地點：{{ eventInfo.activePlace }}</span>
              </p>
            </div>
            <validation-observer>
              <div
                class="funEventsCheckoutStepOne__body"
                v-show="currentTab === 1"
              >
                <client-only>
                  <vue-good-table
                    :columns="couponListTableFields"
                    :rows="eventCouponList"
                    :sort-options="{
                      enabled: false
                    }"
                  >
                    <div slot="emptystate">無</div>
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'couponName'">
                        <div
                          class="funEventsTable__tableRow funEventsTable__couponTitle"
                          :class="{
                            'funEventsTable__tableRow--disabled':
                              props.row.remainingTicket <= 0 &&
                              props.row.remainingTicket !== -2147483648
                          }"
                        >
                          <div
                            class="funEventsTable__couponName"
                            :class="{
                              'funEventsTable__tableRow--disabled':
                                props.row.remainingTicket <= 0 &&
                                props.row.remainingTicket !== -2147483648
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
                              props.row.remainingTicket <= 0 &&
                              props.row.remainingTicket !== -2147483648
                          }"
                        >
                          <div class="funEventsTable__quantitySelector">
                            <button
                              class="funEventsTable__quantityBtn"
                              :class="{
                                'funEventsTable__quantityBtn--disabled':
                                  props.row.remainingTicket <= 0 &&
                                  props.row.remainingTicket !== -2147483648
                              }"
                              :disabled="
                                (props.row.remainingTicket <= 0 &&
                                  props.row.remainingTicket !== -2147483648) ||
                                couponOrder[
                                  eventCouponList.findIndex(
                                    (item) =>
                                      item.serialno === props.row.serialno
                                  )
                                ] <= 0
                              "
                              @click="
                                handleOrderDecrement(
                                  eventCouponList.findIndex(
                                    (item) =>
                                      item.serialno === props.row.serialno
                                  ),
                                  props.row.couponSaleUnit
                                )
                              "
                            >
                              -
                            </button>
                            <span class="funEventsTable__quantityText">
                              <validation-provider
                                :rules="`oneOf:0,${props.row.couponPurchaseRange}`"
                              >
                                <label :for="'inc' + props.row.serialno">
                                  {{
                                    couponOrder[
                                      eventCouponList.findIndex(
                                        (item) =>
                                          item.serialno === props.row.serialno
                                      )
                                    ]
                                  }}
                                  <input
                                    :id="'inc' + props.row.serialno"
                                    type="number"
                                    v-model="
                                      couponOrder[
                                        eventCouponList.findIndex(
                                          (item) =>
                                            item.serialno === props.row.serialno
                                        )
                                      ]
                                    "
                                    :min="props.row.couponBuyLow"
                                    :max="props.row.couponbuyhigh"
                                    :disabled="
                                      props.row.remainingTicket <= 0 &&
                                      props.row.remainingTicket !== -2147483648
                                    "
                                    :class="{
                                      'funEventsTable__tableRow--disabled':
                                        props.row.remainingTicket <= 0 &&
                                        props.row.remainingTicket !==
                                          -2147483648
                                    }"
                                  />
                                </label>
                              </validation-provider>
                            </span>
                            <button
                              class="funEventsTable__quantityBtn"
                              :class="{
                                'funEventsTable__quantityBtn--disabled':
                                  props.row.remainingTicket <= 0 &&
                                  props.row.remainingTicket !== -2147483648
                              }"
                              :disabled="
                                (props.row.remainingTicket <= 0 &&
                                  props.row.remainingTicket !== -2147483648) ||
                                couponOrder[
                                  eventCouponList.findIndex(
                                    (item) =>
                                      item.serialno === props.row.serialno
                                  )
                                ] >= props.row.couponbuyhigh
                              "
                              @click="
                                handleOrderIncrement(
                                  eventCouponList.findIndex(
                                    (item) =>
                                      item.serialno === props.row.serialno
                                  ),
                                  props.row.couponSaleUnit
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
                              props.row.remainingTicket <= 0 &&
                              props.row.remainingTicket !== -2147483648
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
                      <span v-if="props.column.field == 'couponStatus'">
                        <div
                          class="funEventsTable__tableRow funEventsTable__couponTitle"
                          :class="{
                            'funEventsTable__tableRow--disabled':
                              props.row.remainingTicket <= 0 &&
                              props.row.remainingTicket !== -2147483648
                          }"
                        >
                          <div
                            class="funEventsTable__couponStatus"
                            :class="{
                              'funEventsTable__tableRow--disabled':
                                props.row.remainingTicket <= 0 &&
                                props.row.remainingTicket !== -2147483648
                            }"
                          >
                            <div>{{ props.row.couponStatus }}</div>
                          </div>
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
                  <base-checkbox
                    v-model="agreePrivacy"
                    id="agreePrivacy1"
                    :value="agreePrivacy"
                  >
                    同意STAYFUN
                    <a
                      href="/privacy"
                      class="funEventsCheckoutBody__box__link"
                      target="_blank"
                      >隱私權條款</a
                    >
                  </base-checkbox>
                  <base-checkbox
                    v-model="agreePrivacy2"
                    id="agreePrivacy2"
                    :value="agreePrivacy2"
                    v-if="eventInfo.activePsTitle"
                  >
                    同意
                    <a
                      href="/privacy"
                      class="funEventsCheckoutBody__box__link"
                      target="_blank"
                      >活動報名條款</a
                    >
                  </base-checkbox>
                </div>
              </div>
              <div class="funEventsCheckout__btnbox" v-show="currentTab === 1">
                <base-button
                  type="greyTwoOutline"
                  @click="currentTab = 0"
                  class="funEventsCheckout__btn"
                  >取消</base-button
                >
                <base-button
                  :type="
                    (eventInfo.activePsTitle && !agreePrivacy2) ||
                    !agreePrivacy ||
                    !hasCouponInCart
                      ? 'greyOne'
                      : 'greyTwo'
                  "
                  @click="handleCreateActivity"
                  class="funEventsCheckout__btn"
                  :disabled="
                    (eventInfo.activePsTitle && !agreePrivacy2) ||
                    !agreePrivacy ||
                    !hasCouponInCart
                  "
                  >下一步</base-button
                >
              </div>
            </validation-observer>
            <validation-observer v-slot="{ invalid }">
              <div
                class="funEventsCheckoutStepTwo__body"
                v-show="currentTab === 2"
              >
                <div class="funEventsCheckoutStepTwo__inputbox">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="max:50|required"
                  >
                    <base-label
                      text="姓名"
                      required
                      :valid="!errors.length"
                      :hint="{
                        text: errors.length ? errors[0] : '',
                        type: 'warning'
                      }"
                    >
                      <base-input
                        v-model="form.name"
                        @blur="initialzied = true"
                        :valid="!errors.length"
                      />
                    </base-label>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    rules="max:50|required"
                  >
                    <base-label
                      text="聯絡電話"
                      required
                      :valid="!errors.length"
                      :hint="{
                        text: errors.length ? errors[0] : '',
                        type: 'warning'
                      }"
                    >
                      <base-input
                        v-model="form.phone"
                        @blur="initialzied = true"
                        :valid="!errors.length"
                      />
                    </base-label>
                  </validation-provider>
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
                    <span>金額小計 :</span>
                    <span>
                      ${{
                        eventCouponList
                          .reduce(
                            (prev, curr, index) =>
                              (prev +=
                                Number(
                                  couponOrder.find((item, i) => i === index)
                                ) *
                                Number(curr.couponPrice.split(',').join(''))),
                            0
                          )
                          .toLocaleString('en')
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="funEventsCheckout__btnbox" v-show="currentTab === 2">
                <base-button
                  type="greyTwoOutline"
                  @click="currentTab = 0"
                  class="funEventsCheckout__btn"
                  >取消</base-button
                >
                <base-button
                  type="greyTwo"
                  @click="currentTab = 1"
                  class="funEventsCheckout__btn"
                  >上一步</base-button
                >
                <base-button
                  :type="invalid ? 'greyOne' : 'greyTwo'"
                  @click="currentTab = 3"
                  class="funEventsCheckout__btn"
                  :disabled="invalid"
                  >下一步</base-button
                >
              </div>
            </validation-observer>
            <validation-observer v-slot="{ invalid }">
              <div
                class="funEventsCheckoutStepThree__body"
                v-show="currentTab === 3"
              >
                <div class="funEventsCheckoutStepThree__inputbox">
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
                          <validation-provider
                            v-slot="{ errors }"
                            rules="required"
                          >
                            <base-label
                              :text="formList[key] ? formList[key].label : ''"
                              :valid="!errors.length"
                              :hint="{
                                text: errors.length ? errors[0] : '',
                                type: 'warning'
                              }"
                              :required="
                                formDataDetail[index][key] &&
                                formDataDetail[index][key].details.isRequired
                              "
                            >
                              <base-select
                                :options="areaList"
                                @input="
                                  formDataDetail[index][key].areaId = $event
                                "
                                :value="formDataDetail[index][key].areaId"
                                :valid="!errors.length"
                              />
                              <base-select
                                :options="countyList(index)"
                                @input="
                                  formDataDetail[index][key].countyId = $event
                                "
                                :value="formDataDetail[index][key].countyId"
                                :valid="!errors.length"
                                :disabled="
                                  formDataDetail[index][key].areaId.length === 0
                                "
                              />
                              <base-input
                                type="text"
                                @input="
                                  formDataDetail[index][key].address = $event
                                "
                                :value="formDataDetail[index][key].address"
                                max="50"
                                min="1"
                                :valid="!errors.length"
                              />
                            </base-label>
                          </validation-provider>
                        </div>
                        <div
                          v-if="
                            key !== 'couponName' &&
                            key !== 'contactaddress' &&
                            key !== 'customText1' &&
                            key !== 'customText2' &&
                            key !== 'customDropDownList1' &&
                            key !== 'customDropDownList2' &&
                            key !== 'customDropDownList3'
                          "
                        >
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="`max:50${
                              formDataDetail[index][key]
                                ? formDataDetail[index][key].details.isRequired
                                  ? '|required'
                                  : ''
                                : ''
                            }`"
                          >
                            <base-label
                              :text="formList[key] ? formList[key].label : ''"
                              :valid="!errors.length"
                              :hint="{
                                text: errors.length ? errors[0] : '',
                                type: 'warning'
                              }"
                              :required="
                                formDataDetail[index][key] &&
                                formDataDetail[index][key].details.isRequired
                              "
                            >
                              <base-input
                                :type="
                                  formList[key].type ? formList[key].type : ''
                                "
                                v-if="
                                  formList[key] &&
                                  (formList[key].type === 'text' ||
                                    formList[key].type === 'number')
                                "
                                @input="handleInput($event, index, key)"
                                :value="formDataDetail[index][key].value"
                                :max="
                                  formList[key] &&
                                  formList[key].label === 'departmentHeadCount'
                                    ? '5'
                                    : '50'
                                "
                                :min="
                                  formList[key] &&
                                  formList[key].type === 'number'
                                    ? '1'
                                    : null
                                "
                                :valid="!errors.length"
                              />
                              <base-datepicker
                                type="date"
                                v-if="
                                  formList[key] && formList[key].type === 'date'
                                "
                                :valid="!errors.length"
                                @input="handleInput($event, index, key)"
                                :value="formDataDetail[index][key].value"
                                format="YYYY-MM-DD"
                              />
                              <b-form-radio-group
                                :id="`${formList[key].label}+${index}`"
                                @input="handleInput($event, index, key)"
                                :value="formDataDetail[index][key].value"
                                :name="`${formList[key].label}+${index}`"
                                v-if="
                                  formList[key] &&
                                  formList[key].type === 'radio'
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
                                    >{{ item.columnText }}</b-form-radio
                                  >
                                </template>
                              </b-form-radio-group>
                            </base-label>
                          </validation-provider>
                        </div>
                        <div
                          v-if="
                            key === 'customText1' ||
                            key === 'customText2' ||
                            key === 'customDropDownList1' ||
                            key === 'customDropDownList2' ||
                            key === 'customDropDownList3'
                          "
                        >
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="`max:50${
                              key.details
                                ? key.details.isRequired
                                  ? '|required'
                                  : ''
                                : ''
                            }`"
                          >
                            <base-label
                              :text="
                                formDataDetail[index][key]
                                  ? formDataDetail[index][key].details
                                      .customColumnName
                                  : ''
                              "
                              :valid="!errors.length"
                              :hint="{
                                text: errors.length ? errors[0] : '',
                                type: 'warning'
                              }"
                              :required="
                                formDataDetail[index][key] &&
                                formDataDetail[index][key].details.isRequired
                              "
                            >
                              <base-input
                                :type="
                                  formList[key].type ? formList[key].type : ''
                                "
                                v-if="
                                  formList[key] &&
                                  (formList[key].type === 'text' ||
                                    formList[key].type === 'number')
                                "
                                @input="handleInput($event, index, key)"
                                :value="formDataDetail[index][key].value"
                                :max="
                                  formList[key] &&
                                  formList[key].label === 'departmentHeadCount'
                                    ? '5'
                                    : '50'
                                "
                                :min="
                                  formList[key] &&
                                  formList[key].type === 'number'
                                    ? '1'
                                    : null
                                "
                                :valid="!errors.length"
                              />
                              <base-select
                                :options="
                                  formDataDetail[index][
                                    key
                                  ].details.customColumnOptions
                                    .split(',')
                                    .map((item) => ({
                                      label: item,
                                      value: item
                                    }))
                                "
                                @input="handleInput($event, index, key)"
                                :value="formDataDetail[index][key].value"
                                :valid="!errors.length"
                                v-if="
                                  formList[key] &&
                                  formList[key].type === 'select'
                                "
                              />
                            </base-label>
                          </validation-provider>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    <span>金額小計 :</span>
                    <span>
                      ${{
                        eventCouponList
                          .reduce(
                            (prev, curr, index) =>
                              (prev +=
                                Number(
                                  couponOrder.find((item, i) => i === index)
                                ) *
                                Number(curr.couponPrice.split(',').join(''))),
                            0
                          )
                          .toLocaleString('en')
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="funEventsCheckout__btnbox" v-show="currentTab === 3">
                <base-button
                  type="greyTwoOutline"
                  @click="currentTab = 0"
                  class="funEventsCheckout__btn"
                  >取消</base-button
                >
                <base-button
                  type="greyTwo"
                  @click="currentTab = 2"
                  class="funEventsCheckout__btn"
                  >上一步</base-button
                >
                <base-button
                  :type="invalid ? 'greyOne' : 'greyTwo'"
                  @click="handleCreateUserInfo"
                  class="funEventsCheckout__btn"
                  :disabled="invalid"
                  >下一步</base-button
                >
              </div>
            </validation-observer>
            <div
              class="funEventsCheckoutStepFour__body"
              v-show="currentTab === 4"
            >
              <div class="funEventsCheckoutStepFour__table">
                <client-only>
                  <vue-good-table
                    :columns="checkoutTableFields"
                    :rows="checkoutList"
                    :sort-options="{
                      enabled: false
                    }"
                  >
                    <div slot="emptystate">無</div>
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'couponQuantity'">
                        <div class="funEventsTable__tableRow">
                          {{ props.row.couponQuantity }}
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
                    <div slot="table-actions-bottom">
                      <div class="funEventsTable__bottom">
                        <div class="funEventsTable__bottomRow">
                          <div class="funEventsTable__bottomRowText">
                            總金額
                          </div>
                          <div class="funEventsTable__bottomRowValue">
                            ${{ totalPrice.toLocaleString('en') }}
                          </div>
                        </div>
                        <div class="funEventsTable__bottomRow">
                          <div class="funEventsTable__bottomRowText">
                            享樂金折抵
                          </div>
                          <div
                            class="funEventsTable__bottomRowValue funEventsTable__bottomRowValue--emphasized"
                          >
                            ${{ discount.toLocaleString('en') }}
                          </div>
                        </div>
                        <div class="funEventsTable__bottomRow">
                          <div class="funEventsTable__bottomRowText">
                            應付金額
                          </div>
                          <div class="funEventsTable__bottomRowValue">
                            ${{ totalPriceAfterDiscount.toLocaleString('en') }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </vue-good-table>
                </client-only>
              </div>
              <div class="funEventsCheckoutStepFour__paymentType">
                <span>付款方式</span>
                <span>
                  {{
                    eventInfo.activityPayType === 1
                      ? '由主辦單位另行收取費用'
                      : totalPriceAfterDiscount > 0
                      ? '信用卡/其他'
                      : '無須付款'
                  }}
                </span>
              </div>
              <div
                class="funEventsCheckoutStepFour__paymentType"
                v-if="eventInfo.activityPayType === 1"
              >
                <span>發票類型</span>
                <span>請洽主辦單位</span>
              </div>
              <div
                class="funEventsCheckoutStepFour__paymentType"
                v-if="
                  eventInfo.activityPayType === 0 && totalPriceAfterDiscount > 0
                "
              >
                <div class="funEventsCheckoutStepFour__title">發票類型</div>
                <div class="funEventsCheckoutStepFour__paymentSelector">
                  <default-receipt-selector
                    @input="handleReceiptTypeUpdate"
                    @address-area-update="handleGetCounty"
                    @form-update="receiptInfo = $event"
                    :areaOptions="areaList"
                    :countyOptions="county"
                  />
                </div>
              </div>
            </div>
            <div class="funEventsCheckout__btnbox" v-show="currentTab === 4">
              <base-button
                type="greyTwoOutline"
                @click="currentTab = 0"
                class="funEventsCheckout__btn"
              >
                取消
              </base-button>
              <base-button
                :type="
                  eventInfo.activityPayType === 0 &&
                  totalPriceAfterDiscount > 0 &&
                  (receiptType === '' ||
                    Object.keys(receiptInfo).length === 0 ||
                    !receiptInfo.isValid)
                    ? 'greyOne'
                    : 'primary'
                "
                @click="handleCreateOrder"
                class="funEventsCheckout__btn"
                :disabled="
                  (eventInfo.activityPayType === 0 &&
                    (totalPriceAfterDiscount > 0 &&
                    (receiptType === '' || Object.keys(receiptInfo).length === 0 || !receiptInfo.isValid)))
                "
              >
                送出
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </default-main-container>
    <client-only>
      <default-dialog
        :active="dialogState"
        @cancel="handleDialogClose"
        @accept="handleDialogClose"
        @confirm="handleDialogConfirm"
        :message="dialogContent.message"
        :title="dialogContent.title"
        :type="dialogContent.type"
        :icon="dialogContent.icon"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import VueSlickCarousel from 'vue-slick-carousel'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { $axios } from '~/utils/api'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseSelect from '~/components/BaseSelect.vue'
import BaseCheckbox from '~/components/BaseCheckbox.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseDatepicker from '~/components/BaseDatepicker.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import DefaultReceiptSelector from '~/components/DefaultReceiptSelector.vue'
import { funEventsStore, dialogStore, commonStore, pointStore } from '~/store'

require('vue-good-table/dist/vue-good-table.css')

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
    DefaultReceiptSelector,
    BaseSelect,
    BaseCheckbox,
    BaseDatepicker,
    BaseInput,
    ValidationObserver,
    ValidationProvider
  },
  scrollToTop: true
})
export default class FunEventsDetail extends Vue {
  private get hasCouponInCart(): boolean {
    return this.couponOrder.find((item: number) => item > 0) !== undefined
  }

  private async handleCreateOrder() {
    try {
      this.$nuxt.$loading.start()
      await this.sendCreateOrderRequest()
      dialogStore.setContent({
        title: '訂單建立成功！',
        message: '請至會員專區查看訂單',
        type: 'accept',
        initializer: 'fun-event-order-success'
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
    } catch (e) {
      dialogStore.setContent({
        title: '請注意',
        icon: true,
        message: e.message,
        type: 'accept'
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  private async handleCreateUserInfo() {
    try {
      this.$nuxt.$loading.start()
      await this.sendCreateActivityUserInfoRequest()
      await this.sendGetPointDiscountRequest()
      this.currentTab = 4
    } catch (e) {
      // error
      dialogStore.setContent({
        title: '請注意',
        message: '您的請求無法被進行，請稍後再試',
        icon: true
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  get discount(): number {
    let discount = 0
    if (pointStore.pointDiscount && pointStore.pointDiscount.length) {
      discount = pointStore.pointDiscount.reduce((prev: number, curr: any) => {
        if (curr.pointType.toString() === '點數折抵') {
          return (prev += curr.pointAmount)
        } else {
          return prev
        }
      }, 0)
    }
    return discount
  }

  get totalPriceAfterDiscount(): number {
    return this.totalPrice - this.discount
  }

  get totalPrice(): number {
    return this.checkoutList.reduce(
      (prev, curr) => (prev += Number(curr.couponPrice.split(',').join(''))),
      0
    )
  }

  private orderNumber: string = ''

  private paymentDetailList: Array<any> = []

  get userPaymentInfoList(): Array<any> {
    // Data Structure:
    // getUserInfoList: [
    //   {
    //     couponSerialno: this.paymentDetailList,
    //     paymentSerialno: 'string',
    //     keyValueList: [
    //       {
    //         columnName: 'string',
    //         columnValue: 'string',
    //         customColumnName: 'string',
    //         sequence: 0
    //       }
    //     ]
    //   }
    // ]

    let currentTraversedIndex = 0
    let result: Array<any> = []
    const formDetail = this.formDataDetail.map((item: any) => {
      return Object.keys(item)
        .filter((key: string) => key !== 'couponName')
        .map((key: string) => {
          if (
            key === 'customText1' ||
            key === 'customText2' ||
            key === 'customDropDownList1' ||
            key === 'customDropDownList2' ||
            key === 'customDropDownList3'
          ) {
            return {
              columnName: key,
              customColumnName: key,
              columnValue: item[key].value
            }
          } else if (key === 'contactaddress') {
            return {
              columnName: 'contactaddress',
              columnValue:
                item[key].areaId.toString() +
                item[key].countyId.toString() +
                item[key].address.toString(),
              customColumnName: ''
            }
          } else {
            return {
              columnName: key,
              columnValue: item[key].value,
              customColumnName: ''
            }
          }
        })
    })
    this.paymentDetailList.forEach((coupon: any) => {
      coupon.paymentList.forEach((payment: any) => {
        result = [
          ...result,
          {
            couponSerialno: coupon.couponSerialno,
            paymentSerialno: payment.paymentSerialno,
            keyValueList: formDetail[currentTraversedIndex]
          }
        ]
        currentTraversedIndex += 1
      })
    })

    return result
  }

  get county() {
    return commonStore.countyList.length
      ? commonStore.countyList.map((item: any) => ({
          label: item.area,
          value: item.area,
          zipcode: item.zipCode
        }))
      : []
  }

  private receiptType: '1' | '2' | '3' | '4' | '5' | '' = ''

  private receiptInfo: any = {}

  private async handleReceiptTypeUpdate(val: '1' | '2' | '3' | '4' | '5') {
    if (this.receiptType !== '2' && this.receiptType !== '5') {
      if (val === '2' || val === '5') {
        await this.sendGetAreasRequest()
      }
    }
    this.receiptType = val
  }

  private async handleGetCounty(val: string) {
    await this.sendGetCountyRequest(val)
  }

  private async handleCreateActivity() {
    try {
      const result = await this.sendSignUpActivityRequest()
      this.orderNumber = result.orderNumber
      this.paymentDetailList = result.paymentDetailList

      this.currentTab = 2
    } catch (e) {
      // join activity error
      dialogStore.setContent({
        icon: true,
        // title: '請選擇票種',
        title: e.message,
        type: 'accept'
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
    }
  }

  get tabAllowed() {
    return (tab: number) => {
      if (this.isFilled.length) {
        const maxTab = this.isFilled.reduce(function (a, b) {
          return Math.max(a, b)
        })
        return tab < maxTab
      } else {
        return tab === 1
      }
    }
  }

  get totalAvailableSpots() {
    return this.eventInfo.AccountCountLimit - this.eventInfo.TotalActivityCount
  }

  get totalSpots() {
    return this.eventInfo.AccountCountLimit
  }

  get totalAvailableCoupons() {
    return (
      this.eventInfo.SalesCountLimit +
      this.eventInfo.salesWaitingListCount -
      this.eventInfo.signupCount
    )
  }

  get totalCoupons() {
    return this.eventInfo.SalesCountLimit + this.eventInfo.salesWaitingListCount
  }

  get purchaseBtnStatus(): string {
    const remainingTickets = this.eventCouponList.reduce(
      (prev: number, curr: any) => {
        if (Number(curr.remainingTicket) !== -2147483648) {
          return (prev += Number(curr.remainingTicket))
        } else {
          return prev
        }
      },
      0
    )
    const hasInfiniteTickets = this.eventCouponList.find(
      (item: any) => item.remainingTicket === -2147483648
    )
    if (
      (this.eventInfo.ButtonText !== '' &&
        !this.eventInfo.isEnableWaitingList) ||
      this.totalAvailableSpots <= 0
    ) {
      return '已額滿'
    } else if (new Date(this.eventInfo.activeEnddate) < new Date()) {
      return '已結束'
    } else if (new Date(this.eventInfo.activeBegindate) > new Date()) {
      return '尚未開始報名'
    } else if (this.eventCouponList.length === 0) {
      return '尚無可購買之票券'
    }
    if (
      (remainingTickets <= 0 && !hasInfiniteTickets) ||
      this.totalAvailableCoupons <= 0
    ) {
      return '已售空'
    }
    return '立即報名'
  }

  private formList: any = {
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
    dietaryPreference: { label: '飲食偏好', type: 'radio' },
    customText1: { label: 'customColumnName', type: 'text' },
    customText2: { label: 'customColumnName', type: 'text' },
    customDropDownList1: { label: 'customColumnName', type: 'select' },
    customDropDownList2: { label: 'customColumnName', type: 'select' },
    customDropDownList3: { label: 'customColumnName', type: 'select' }
  }

  private initialzied: boolean = false

  private form: any = {
    phone: '',
    name: ''
  }

  private timer: number = 0

  private formDataDetail: any = []

  private formData: any = []

  private formCreated: boolean = false

  private getFormData(): Array<any> {
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
            if (inputName === 'contactaddress') {
              obj = {
                ...obj,
                [inputName]: {
                  areaId: '',
                  countyId: '',
                  address: '',
                  details: arr[k]
                }
              }
            } else {
              obj = { ...obj, [inputName]: { value: '', details: arr[k] } }
            }
          }
          res = [...res, { ...obj, couponName: name }]
        }
      }
    }
    return res
  }

  private handleInput(
    value: string | number,
    index: number,
    key: string
  ): void {
    this.formDataDetail[index][key].value = value
  }

  @Watch('currentTab')
  private onTabUpdate(newVal: number, oldVal: number): void {
    window.scrollTo(0, 0)
    // Dynamically generate form
    if (newVal === 3 && !this.formCreated) {
      const form = this.getFormData()
      this.formDataDetail = form
      this.formCreated = true
    }
    if (newVal === 1) {
      this.initialzied = false
    }
    // Reset all user-filled details
    if (newVal === 0) {
      this.formDataDetail = []
      this.form = {
        phone: '',
        name: ''
      }
      this.couponOrder = this.couponOrder.map(() => 0)
      this.agreePrivacy = false
      this.agreePrivacy2 = false
      this.formCreated = false
      this.initialzied = false
      this.receiptInfo = {}
      this.orderNumber = ''
      this.paymentDetailList = []
    }
    if (newVal === 2 && !this.initialzied) {
      dialogStore.setContent({
        title: '開始報名後請在 15 分鐘內完成！',
        icon: true,
        type: 'accept'
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)

      clearTimeout(this.interval)
      this.timer = 15 * 60 - 1
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

  @Watch('formDataDetail', { deep: true })
  private onValueChange(newVal: any): void {
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
          value: item.area
        }))
      : []
  }

  get countyList() {
    return (index: number) => {
      if (commonStore.countyListForFunEvents.length) {
        const match = commonStore.countyListForFunEvents.find(
          (subarr: any) => subarr[subarr.length - 1] === index
        )
        if (match) {
          return match.map((item: any) => ({
            label: item.area,
            value: item.area
          }))
        } else {
          return Array(0)
        }
      } else {
        return Array(0)
      }
    }
  }

  private currentTab: number = 0

  private tabs: Array<any> = [
    { label: '1 選擇票種', value: 1 },
    { label: '2 會員資料', value: 2 },
    { label: '3 填寫表單', value: 3 },
    { label: '4 付款', value: 4 }
  ]

  private isFilled: Array<number> = []

  private handleApply(): void {
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

  private handleDialogConfirm(): void {
    if (dialogStore.content.initializer === 'funevents-serialno-confirmTab') {
      dialogStore.setMaskActive(false)
      dialogStore.setActive(false)
      this.currentTab = 1
    }
  }

  private handleDialogClose(): void {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    if (dialogStore.content.initializer === 'fun-event-order-success') {
      this.$router.push('/member/info')
    }
  }

  get dialogState(): boolean {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  private couponListTableFields: Array<TableField> = [
    { label: '票種名稱', field: 'couponName' },
    { label: '數量', field: 'couponQuantity' },
    { label: '數量', field: 'couponStatus' },
    { label: '小計($)', field: 'couponPrice' }
  ]

  private tableFields: Array<TableField> = [
    { label: '票種', field: 'couponName' },
    { label: '販售時間', field: 'couponAvailableDate' },
    { label: '狀態', field: 'couponStatus' },
    { label: '票價($)', field: 'couponPrice' }
  ]

  private checkoutTableFields: Array<TableField> = [
    { label: '票種名稱', field: 'couponName' },
    { label: '數量', field: 'couponQuantity' },
    { label: '小計($)', field: 'couponPrice' }
  ]

  private carouselSetting: any = {
    dots: false,
    edgeFriction: 0.35,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  }

  get checkoutList(): Array<any> {
    return this.couponOrder
      .map((item: number, index: number) => {
        return {
          serialno: this.eventCouponList[index].serialno,
          couponName: this.eventCouponList[index].couponName,
          couponQuantity: item,
          couponPrice: (
            Number(
              this.eventCouponList[index].couponPrice.split(',').join('')
            ) * item
          ).toLocaleString('en')
        }
      })
      .filter((item: any) => item.couponQuantity > 0)
  }

  get couponCheckoutList(): Array<any> {
    return this.checkoutList.map((item: any) => ({
      key: item.serialno,
      value: item.couponQuantity.toString()
    }))
  }

  get eventCouponList(): Array<any> {
    return Object.keys(funEventsStore.eventDetail).length
      ? funEventsStore.eventDetail.FunActivityCoupons.map((item: any) => {
          let purchaseRange: Array<number> = []
          for (let i = item.couponBuyLow; i <= item.couponbuyhigh; i++) {
            purchaseRange = [...purchaseRange, i]
          }
          return {
            ...item,
            couponBegindate: new Date(item.couponBegindate).toLocaleString(
              'zh-TW',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }
            ),
            couponEnddate: new Date(item.couponEnddate).toLocaleString(
              'zh-TW',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }
            ),
            couponPrice: item.couponPrice.toLocaleString('en'),
            couponStatus: this.eventStatus(
              item.couponBegindate,
              item.couponEnddate
            ),
            couponPurchaseRange: purchaseRange.join(',')
          }
        })
      : []
  }

  private couponOrder: Array<number> = []

  @Watch('eventCouponList', { deep: true })
  private onPropertyChange(newVal: Array<TableData>): void {
    const res = Array(newVal.length).fill(0)
    this.couponOrder = res
  }

  private handleOrderDecrement(index: number, value: number): void {
    if (this.couponOrder[index] > 0) {
      const res: Array<number> = this.couponOrder.map((item, i) => {
        if (i === index) {
          const num = Number(item) - value
          item = num
          return item
        } else {
          return item
        }
      })
      this.couponOrder = res
    }
  }

  private handleOrderIncrement(index: number, value: number): void {
    const res: Array<number> = this.couponOrder.map((item, i) => {
      if (i === index) {
        const num = Number(item) + value
        item = num
        return item
      } else {
        return item
      }
    })
    this.couponOrder = res
  }

  private agreePrivacy: boolean = false

  private agreePrivacy2: boolean = false

  private eventStatus(s: string, e: string): string {
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
    return ''
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

  get eventDescription(): string {
    return Object.keys(funEventsStore.eventDetail).length
      ? funEventsStore.eventDetail.description
      : ''
  }

  get eventImages(): Array<any> {
    return Object.keys(funEventsStore.eventDetail).length
      ? funEventsStore.eventDetail.FunActivityImages.slice().sort(
          (a: any, b: any) => a.sortNum - b.sortNum
        )
      : []
  }

  private async sendGetEventDetailRequest() {
    try {
      await funEventsStore.getEventDetail({
        token: this.$cookies.get('accessToken'),
        serialno: this.$route.params.serialno
      })
    } catch (e) {
      // error
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '資料加載錯誤，請刷新再試。',
        icon: true,
        type: 'accept'
      })
    }
  }

  private async sendGetAddressMenuRequest() {
    try {
      await commonStore.getArea({ token: this.$cookies.get('accessToken') })
    } catch (e) {
      // error
    }
  }

  private async sendGetCountyRequest(areaName: string, index?: number) {
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

  private async sendSignUpActivityRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/FunActivity/ToSignUpActivity',
      key: process.env.apiKey,
      data: {
        funActivitySerialno: this.eventInfo.serialno,
        itemList: [...this.couponCheckoutList]
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 400:
          throw new Error(result.data.sysmsg)
        case 404:
          throw new Error('Failed to Join Activity')
        default:
          return null
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  private async sendCreateActivityUserInfoRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/FunActivity/ToCreateFunActivityUserInfo',
      key: process.env.apiKey,
      data: {
        orderData: {
          funActivitySerialno: this.eventInfo.serialno,
          orderNumber: this.orderNumber
        },
        getUserInfoList: [...this.userPaymentInfoList]
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 400:
          throw new Error(result.data.sysmsg)
        case 404:
          throw new Error('Failed to Create User Info')
        default:
          return null
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  private async sendGetAreasRequest() {
    try {
      await commonStore.getAreas({ token: this.$cookies.get('accessToken') })
    } catch (e) {
      // error
    }
  }

  private async sendCreateOrderRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/FunActivity/Order',
      key: process.env.apiKey,
      data: {
        OrderNumber: this.orderNumber,
        FunActivitySerialNo: this.$route.params.serialno,
        amount: this.totalPrice,
        invoiceType:
          Number(this.receiptType) === 0 ? 1 : Number(this.receiptType),
        isIE: false,
        IsGiftOrder: false
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    // 會員載具
    if (this.receiptType === '2') {
      requestBody.data.buyerName = this.receiptInfo.receiver.toString()
      requestBody.data.buyerAddress =
        this.receiptInfo.addressZipCode.toString() +
        this.receiptInfo.addressArea.toString() +
        this.receiptInfo.addressCounty.toString() +
        this.receiptInfo.addressLine.toString()
    }
    // 手機載具 || 自然人憑證
    if (this.receiptType === '3' || this.receiptType === '4') {
      requestBody.data.carrierId = this.receiptInfo.barcode.toString()
    }
    // 三聯式發票
    if (this.receiptType === '5') {
      requestBody.data.buyerName = this.receiptInfo.receiver.toString()
      requestBody.data.buyerAddress =
        this.receiptInfo.addressZipCode.toString() +
        this.receiptInfo.addressArea.toString() +
        this.receiptInfo.addressCounty.toString() +
        this.receiptInfo.addressLine.toString()
      requestBody.data.buyerID = this.receiptInfo.identification.toString()
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 40002:
        case 60007:
          throw new Error(result.data.sysmsg)

        case 400:
        case 500:
          throw new Error('Failed to Create Fun Activity Order')
        default:
          return null
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  private async sendGetPointDiscountRequest() {
    try {
      await pointStore.getDiscountAmount({
        token: this.$cookies.get('accessToken'),
        amount: this.totalPrice
      })
    } catch (e) {
      // error
    }
  }

  private async fetch() {
    await this.sendGetEventDetailRequest()
  }

  private activated() {
    this.currentTab = 0
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetEventDetailRequest()
      await this.sendGetAddressMenuRequest()
      this.$nuxt.$loading.finish()
    })
  }

  private interval: any = null

  private beforeDestroyed() {
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
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  &__carousel {
    float: left;
    width: 100%;
    height: 380px;
    margin-bottom: $spacing-m;
    @include grid-lg {
      width: 40%;
    }
    @include grid-xl {
      margin-bottom: 0;
    }
  }
  &__img {
    width: 100%;
    height: 380px;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  &__text {
    float: left;
    width: 100%;
    @include grid-lg {
      width: calc(60% - 58px);
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
    width: 300px;
    > div {
      padding: $spacing-l 0;
    }
  }
  &__couponDate {
    width: 200px;
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
      input {
        color: $whiteOne;
      }
    }
    input {
      display: none;
    }
    label {
      width: 25px;
      text-align: center;
    }
  }
  &__bottom {
    padding: $spacing-xxl 0;
  }
  &__bottomRow {
    display: flex;
    justify-content: flex-end;
    padding: $spacing-s;
  }
  &__bottomRowText {
    flex: 0 0 30%;
    font-weight: bold;
    color: $greyThree;
  }
  &__bottomRowValue {
    flex: 0 0 16%;
    font-weight: bold;
    color: $greyThree;
    &--emphasized {
      color: $primary;
      font-size: $fz-xl;
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
    margin: $spacing-s;
  }
  &__subtitlebox {
    text-align: center;
  }
}
.funEventsCheckoutHeader {
  padding: $spacing-l;
  background-color: #fff;
  &__alertbox {
    background-color: $orangeLighter;
    color: $greyThree;
    padding: $spacing-m $spacing-m;
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
    padding-top: $spacing-m;
    display: flex;
    justify-content: center;
    flex-direction: column;
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
  &__input {
    padding: $spacing-s 0;
  }
  &__inputbox {
    flex: 0 0 100%;
    order: 2;
    max-height: 600px;
    overflow: auto;
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
    font-weight: bold;
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
.funEventsCheckoutStepFour {
  &__paymentType {
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    color: $greyThree;
    margin-top: $spacing-xl;
    border-top: 1px solid $whiteOne;
    border-bottom: 1px solid $whiteOne;
    padding: $spacing-xl 0;
  }
  &__paymentSelector {
    flex: 0 0 100%;
  }
  &__title {
    font-weight: bold;
    color: $greyThree;
    padding-bottom: $spacing-xl;
  }
}
</style>
