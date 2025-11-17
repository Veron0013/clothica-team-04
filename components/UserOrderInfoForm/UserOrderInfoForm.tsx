"use client"

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"
import css from "./UserOrderInfoForm.module.css"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { updateMe } from "@/lib/api/clientApi"
import { PHONE_REGEXP } from "@/lib/vars"
import { useAuthStore } from "@/stores/authStore"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { debounce } from "lodash"
import { useState, useEffect, useMemo } from "react"
import { CityRespNP, searchCities, searchWarehouses, WarehoseRespNP } from "@/lib/api/nPostApi"

const UserInfoFormSchema = Yup.object().shape({
	name: Yup.string().min(2).max(20).required("Це поле обовʼязкове!"),
	lastname: Yup.string().min(3).max(20).required("Це поле обовʼязкове!"),
	phone: Yup.string().matches(PHONE_REGEXP, "Введіть коректний номер телефону").required("Це поле обовʼязкове!"),
	city: Yup.string().min(3).required("Це поле обовʼязкове!"),
	warehoseNumber: Yup.number().min(1).max(10).required("Це поле обовʼязкове!"),
})

interface UserInfoFormValues {
	name: string
	lastname: string
	phone: string
	city?: string
	comment?: string
	warehoseNumber?: string
}

export default function UserOrderInfoForm() {
	const user = useAuthStore((state) => state.user)
	const router = useRouter()

	const [cityQuery, setCityQuery] = useState("") // що вводить користувач
	const [cities, setCities] = useState<CityRespNP[]>([])
	const [selectedCityRef, setSelectedCityRef] = useState<string | null>(null)

	const [warehouses, setWarehouses] = useState<WarehoseRespNP[]>([])
	//const [loadingCities, setLoadingCities] = useState(false)
	const [loadingWarehouses, setLoadingWarehouses] = useState(false)

	console.log("form-user", user, user?.name)

	const initialValues: UserInfoFormValues = {
		name: "Ваше імʼя",
		lastname: "Ваше прізвище",
		phone: user?.phone ? user.phone : "+38(0__) ___- __ - __",
		city: "Ваше місто",
		warehoseNumber: "1",
		comment: "Введіть ваш коментар",
	}

	useEffect(() => {
		debouncedSearch(cityQuery)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cityQuery])

	const debouncedSearch = useMemo(
		() =>
			debounce(async (str: string) => {
				if (str.length < 3) return

				const data = await searchCities(str)
				setCities(data)
			}, 400),
		[]
	)

	const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCityQuery(e.target.value)
		debouncedSearch(e.target.value)
		setSelectedCityRef(null) // якщо юзер почав писати знову — скидаємо вибране місто
	}

	const loadWarehouses = async (cityRef: string) => {
		setLoadingWarehouses(true)
		try {
			const data = await searchWarehouses(cityRef)
			setWarehouses(data)
		} finally {
			setLoadingWarehouses(false)
		}
	}

	const mutation = useMutation({
		mutationFn: (data: UserInfoFormValues) => updateMe(data),
		onSuccess: () => {
			toastMessage(MyToastType.success, "Ви успішно відредагували дані!")
			router.push("/")
		},
	})

	const handleSubmit = (values: UserInfoFormValues, actions: FormikHelpers<UserInfoFormValues>) => {
		mutation.mutate(values, {
			onSettled: () => {
				actions.setSubmitting(false)
			},
			onSuccess: () => {
				actions.resetForm({ values }) // оставляем актуальные значения
			},
		})
	}

	console.log("fetch", cities, warehouses)
	return (
		<div className={css.order_container}>
			<Formik initialValues={initialValues} validationSchema={UserInfoFormSchema} onSubmit={handleSubmit}>
				{({ isSubmitting }) => (
					<Form className={css.form}>
						<fieldset className={css.form}>
							<legend className={css.text}>Особиста інформація</legend>
							<div className={css.label_wrapper}>
								<div className={css.label}>
									<label htmlFor="name">Імʼя*</label>
									<ErrorMessage name="name" component="p" className={css.error} />
									<Field id="name" className={css.input} type="text" name="name" />
								</div>
								<div className={css.label}>
									<label htmlFor="lastname">Прізвище*</label>
									<Field id="lastname" className={css.input} type="text" name="lastname" />
									<ErrorMessage name="lastname" component="p" className={css.error} />
								</div>
							</div>
							<div className={css.label}>
								<label htmlFor="phone">Номер телефону*</label>
								<Field id="phone" className={css.inputTel} type="tel" name="phone" />
								<ErrorMessage name="phone" component="p" className={css.error} />
							</div>
							<div className={css.label_wrapper}>
								<div className={css.label}>
									<label htmlFor="city">Місто доставки*</label>
									<Field
										id="city"
										name="city"
										type="text"
										value={cityQuery}
										onChange={handleCityInputChange}
										className={css.input}
									/>
									<ErrorMessage name="city" component="p" className={css.error} />

									{/* Список підказок */}
									{cities.length > 0 && (
										<ul className={css.suggestions}>
											{cities.map((c) => (
												<li key={c.Ref} onClick={() => loadWarehouses(c.Ref)}>
													{c.Description}, {c.Area}
												</li>
											))}
										</ul>
									)}
								</div>
							</div>

							<div className={css.label}>
								<label htmlFor="warehoseNumber">Номер відділення Нової Пошти*</label>

								<Field
									id="warehoseNumber"
									name="warehoseNumber"
									as="select"
									disabled={!selectedCityRef || loadingWarehouses}
									className={css.input}
								>
									<option value="">Оберіть відділення</option>
									{warehouses.map((wh) => (
										<option key={wh.Number} value={wh.Number}>
											{wh.Number} – {wh.ShortAddress}
										</option>
									))}
								</Field>

								<ErrorMessage name="warehoseNumber" component="p" className={css.error} />
							</div>
						</fieldset>

						<button className={css.button} type="submit" disabled={isSubmitting || mutation.isPending}>
							{mutation.isPending ? "Оформлення замовлення..." : "Оформити замовлення"}
						</button>
					</Form>
				)}
			</Formik>
		</div>
	)
}
