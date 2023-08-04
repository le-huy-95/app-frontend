import './Warehouse_staff.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getDataSearchByEmplyer, updatePickupInProject, getDataSortByWarehouse, updateWarehouseInProject } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify'
import moment from "moment"
import _, { debounce } from "lodash"
import { useTranslation, Trans } from 'react-i18next';
import { NotificationContext } from "../../contexApi/NotificationContext"
import { getAllShippingUnit } from "../services/shippingService"

const WarehouseStatusTwo = (props) => {
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [ListProjectbyStaffWarehouse, setListProjectbyStaffWarehouse] = useState([])
    const [listProjectbyuserStaff, setListProjectbyuserStaff] = useState([])
    const [listProjectSearch, setListProjectSearch] = useState([])
    const [isSearch, SetIsSearch] = useState(false)

    const [showModal, setShowModal] = useState(false)
    const [valueSearch, setvalueSearch] = useState("")
    const [shipping, setShipping] = useState([])
    const [shippingUnit, setShippingUnit] = useState([])
    const [select, setSelect] = useState("")

    const handleShowModal = async () => {
        setShowModal(!showModal)
        if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupName === "Dev") {
            await getALlListNotification(+user.account.shippingunit_id, "Dev")
        }
    }

    const getShippingUnit = async () => {
        let res = await getAllShippingUnit()
        if (res && +res.EC === 0) {
            setShipping(res.DT)

        } else {
            toast.error(res.EM)

        }
    }
    const RenderforDev = async (item) => {
        if (item > 0) {
            setSelect(item)

            await fetchProjectUser(item)

        }
        if (item === "Lựa chọn đơn vị giao hàng") {
            setSelect("")
            setListProjectbyStaffWarehouse([])

        }
    }

    const HandleSearchData = debounce(async (value) => {
        if (!select) {
            let data = value
            setvalueSearch(value)
            if (data) {
                SetIsSearch(true)
                let res = await getDataSearchByEmplyer(data, user.account.Position, +user.account.shippingunit_id)
                if (res && +res.EC === 0) {
                    let data = res.DT.filter(item => item.statuswarehouse_id === 2)
                    if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupName === "Dev") {
                        await getALlListNotification(+user.account.shippingunit_id, "Dev")
                    }
                    setListProjectSearch(data)
                }

            } else {
                SetIsSearch(false)
                await fetchProjectUser(select)

            }
        } else {
            let data = value
            setvalueSearch(value)
            if (data) {
                SetIsSearch(true)
                let res = await getDataSearchByEmplyer(data, user.account.Position, +select)
                if (res && +res.EC === 0) {
                    let data = res.DT.filter(item => item.statuswarehouse_id === 2)
                    if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupName === "Dev") {
                        await getALlListNotification(+user.account.shippingunit_id, "Dev")
                    }
                    setListProjectSearch(data)
                }

            } else {
                SetIsSearch(false)
                await fetchProjectUser(select)

            }
        }


    }, 200)




    const fetchProjectUser = async (select) => {
        if (!select) {
            let res = await getDataSortByWarehouse(+user.account.shippingunit_id, 2)
            if (res && +res.EC === 0) {
                setListProjectbyStaffWarehouse(res.DT)
                if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupName === "Dev") {
                    await getALlListNotification(+user.account.shippingunit_id, "Dev")
                }
            }
        } else {
            let res = await getDataSortByWarehouse(+select, 2)
            if (res && +res.EC === 0) {
                setListProjectbyStaffWarehouse(res.DT)

            }
        }

    }


    useEffect(() => {
        fetchProjectUser();


    }, [])

    useEffect(() => {
        getShippingUnit()
    }, [])
    return (
        <div className='employer-warehouse-container '>
            <div className='left-employer-warehouse d-none d-lg-block '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-employer-warehouse  '>
                <div className='btn-toggle-employer-warehouse d-none d-lg-block'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body-employer-warehouse'>
                    <div className='container'>
                        <div className='header-employer-warehouse'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='location-path-employer-warehouse my-2 col-12 col-lg-6'>
                                        <Link to="/"> Home</Link>

                                        <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                        </span>
                                        <Link to="/Warehouse_staff">Warehouse</Link>
                                    </div>
                                    <div className='search-employer-warehouse my-2 col-12 col-lg-6'>
                                        <div className='search-icon-employer-warehouse'>
                                            <i className="fa fa-search" aria-hidden="true"></i>

                                        </div>
                                        <input
                                            type="text"
                                            placeholder='Search infomation'
                                            onChange={(event) => HandleSearchData(event.target.value)}

                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='body-employer-warehouse'>
                            <div className="container">
                                <div className='name-page-employer-warehouse'>
                                    <h4>
                                        {t('Warehouse-employer.One')}
                                    </h4>
                                    <div className='more-employer-pickup'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>


                                    </div>
                                    <span>{user?.account?.Position}</span>
                                    {user?.account?.groupName === "Dev" &&
                                        <div>
                                            <div className='container'>
                                                <div className='row'>
                                                    <select
                                                        className="form-select my-2 col-5"
                                                        onChange={(event) => { setShippingUnit(event.target.value); RenderforDev(event.target.value) }}

                                                        value={shippingUnit}


                                                    >
                                                        <option defaultValue="Lựa chọn đơn vị giao hàng">Lựa chọn đơn vị giao hàng</option>

                                                        {shipping && shipping.length > 0 &&
                                                            shipping.map((item, index) => {
                                                                return (
                                                                    <option key={`Province - ${index}`} value={item.id}>{item.NameUnit}</option>

                                                                )
                                                            })
                                                        }



                                                    </select >
                                                </div>
                                            </div>

                                        </div>
                                    }

                                    {user?.account?.groupName === "Boss" &&
                                        <div>
                                            <div className='container'>
                                                <div className='row'>
                                                    <select
                                                        className="form-select my-2 col-5"
                                                        onChange={(event) => { setShippingUnit(event.target.value); RenderforDev(event.target.value) }}

                                                        value={shippingUnit}


                                                    >
                                                        <option defaultValue="Lựa chọn đơn vị giao hàng">Lựa chọn đơn vị giao hàng</option>

                                                        {shipping && shipping.length > 0 &&
                                                            shipping.map((item, index) => {
                                                                return (
                                                                    <option key={`Province - ${index}`} value={item.id}>{item.NameUnit}</option>

                                                                )
                                                            })
                                                        }



                                                    </select >
                                                </div>
                                            </div>

                                        </div>
                                    }
                                </div>
                                <div className='sort_warehouse my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-12 col-lg-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_staff" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Two')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 my-2 content-warehouse ' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_no_status" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Three')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_status_one" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Four')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 my-2 content-warehouse ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Warehouse-employer.Five')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <div className='table-wrapper-employer-warehouse-One my-5'>
                                        <div className='container'>
                                            <div className='title-employer-warehouse-One my-3'>
                                                {t('Warehouse-employer.Six')} ({ListProjectbyStaffWarehouse.length})
                                            </div>
                                            <hr />
                                            <div style={{ overflow: "auto" }}>
                                                <table className="table table-bordered table-body-employer-warehouse-One">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th></th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Two')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Three')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Four')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Five')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Seven')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Eight')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Warehouse-employer.Body.Night')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Warehouse-employer.Body.Ten')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Eleven')}
                                                            </th>


                                                        </tr>
                                                    </thead>
                                                    {ListProjectbyStaffWarehouse && ListProjectbyStaffWarehouse.length > 0
                                                        ?
                                                        ListProjectbyStaffWarehouse.map((item, index) => {
                                                            return (
                                                                <tbody key={`item-${index}`}>

                                                                    <tr>
                                                                        {item?.flag === true ?
                                                                            <td>
                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                    <i className="fa fa-flag" aria-hidden="true"></i>
                                                                                </span>
                                                                            </td>
                                                                            :
                                                                            <td></td>

                                                                        }
                                                                        <td>{item.id}</td>
                                                                        <td>{item.order}</td>
                                                                        <td> {item?.Warehouse?.product}</td>
                                                                        <td>
                                                                            {item.quantity}/{item.unit}
                                                                        </td>                                                                    <td>
                                                                            <span style={{ color: "red", fontWeight: "500" }}>  {item?.Statuswarehouse?.status ? item?.Statuswarehouse?.status : "chưa nhập kho"}</span>
                                                                        </td>

                                                                        <td>
                                                                            {item?.User_Warehouse ? item?.User_Warehouse : "chưa ai nhận đơn"}
                                                                            <br />
                                                                            {item?.Number_Warehouse ? item?.Number_Warehouse : ""}

                                                                        </td>
                                                                        <td>{item?.warehouse_time ? moment(`${item?.warehouse_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.warehouseDone_time ? moment(`${item?.warehouseDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        {item.statuswarehouse_id === 2 &&
                                                                            <td>
                                                                                <span style={{ color: "green", fontWeight: "700" }} >
                                                                                    {t('Warehouse-employer.Five')}
                                                                                </span>
                                                                            </td>


                                                                        }

                                                                    </tr>
                                                                </tbody>
                                                            )
                                                        })
                                                        :

                                                        <tr className="table-info">
                                                            <td colSpan={14}>
                                                                <div className='d-flex align-item-center justify-content-center'>

                                                                    <h5>
                                                                        {t('Warehouse-employer.Body.Sixteen')}
                                                                    </h5>
                                                                </div>

                                                            </td>

                                                        </tr>
                                                    }


                                                </table>
                                            </div>
                                        </div>


                                    </div>
                                }
                                {isSearch === true &&
                                    <div className='table-wrapper-employer-warehouse-One my-5'>
                                        <div className='container'>
                                            <div className='title-employer-warehouse-One my-3'>
                                                {t('Warehouse-employer.Body.Nineteen')} ({listProjectSearch.length})</div>
                                            <hr />
                                            <div style={{ overflow: "auto" }}>
                                                <table className="table table-bordered table-body-employer-warehouse-One">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th></th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Two')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Three')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Four')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Five')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Seven')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Eight')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Warehouse-employer.Body.Night')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Warehouse-employer.Body.Ten')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Eleven')}
                                                            </th>


                                                        </tr>
                                                    </thead>
                                                    {listProjectSearch && listProjectSearch.length > 0
                                                        ?
                                                        listProjectSearch.map((item, index) => {
                                                            return (
                                                                <tbody key={`item-${index}`}>

                                                                    <tr>
                                                                        {item?.flag === true ?
                                                                            <td>
                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                    <i className="fa fa-flag" aria-hidden="true"></i>
                                                                                </span>
                                                                            </td>
                                                                            :
                                                                            <td></td>

                                                                        }
                                                                        <td>{item.id}</td>
                                                                        <td>{item.order}</td>
                                                                        <td> {item?.Warehouse?.product}</td>
                                                                        <td>
                                                                            {item.quantity}/{item.unit}
                                                                        </td>
                                                                        <td>
                                                                            <span style={{ color: "red", fontWeight: "500" }}>  {item?.Statuswarehouse?.status ? item?.Statuswarehouse?.status : "chưa nhập kho"}</span>
                                                                        </td>

                                                                        <td>
                                                                            {item?.User_Warehouse ? item?.User_Warehouse : "chưa ai nhận đơn"}
                                                                            <br />
                                                                            {item?.Number_Warehouse ? item?.Number_Warehouse : ""}

                                                                        </td>
                                                                        <td>{item?.warehouse_time ? moment(`${item?.warehouse_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.warehouseDone_time ? moment(`${item?.warehouseDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        {item.statuswarehouse_id === 2 &&
                                                                            <td>
                                                                                <span style={{ color: "green", fontWeight: "700" }} >
                                                                                    {t('Warehouse-employer.Five')}
                                                                                </span>
                                                                            </td>


                                                                        }


                                                                    </tr>
                                                                </tbody>
                                                            )
                                                        })
                                                        :

                                                        <tr className="table-info">
                                                            <td colSpan={14}>
                                                                <div className='d-flex align-item-center justify-content-center'>

                                                                    <h5>
                                                                        {t('Warehouse-employer.Body.Eighteen')}
                                                                    </h5>
                                                                </div>

                                                            </td>

                                                        </tr>
                                                    }


                                                </table>
                                            </div>
                                        </div>


                                    </div>

                                }
                            </div>

                        </div>

                    </div>

                </div>


            </div >

        </div >




    )


}

export default WarehouseStatusTwo;