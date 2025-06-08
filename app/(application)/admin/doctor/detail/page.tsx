"use client"

import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import TextareaAutosize from "react-textarea-autosize"
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { numberInLetter } from "@/lib/utils";
import { uploadImageToSupabase } from '@/lib/uploadHelper';
import { LoadingCircle } from "@/components/loading";

export default function AdminSchedulePage() {
    const [doctor, setDoctor] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");
    const [reload, setReload] = useState<number>(0);

    const [newDoctor, setNewDoctor] = useState<boolean>(false);

    const fetchDoctors = async () => {
        const res = await fetch('/api/admin/doctor/fetch_all')
        if (!res.ok) {
            throw new Error('Failed to fetch doctors');
        }
        const data = await res.json();
        console.log(data);
        setDoctor(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchDoctors()
    }, [reload])

    return (
        <div className="flex flex-col items-center  bg-gray-50">
            <h1 className="text-2xl font-bold text-center my-8">醫生基本資料設定</h1>
            <section className="flex flex-row w-[60rem]">

                <nav className="flex flex-col rounded-md bg-white shadow-md h-fit">
                    {doctor.map((d) => (
                        <div key={d.id} className="p-4 border-b hover:bg-gray-50 cursor-pointer select-none" onClick={() => {
                            setSelectedDoctor(d.id);
                            setNewDoctor(false);
                            console.log("Selected Doctor ID:", d.id);
                        }}>
                            <img src={d.image || "/images/default-doctor.jpg"}
                                alt={d.name}
                                className="w-20 aspect-square rounded-full mb-2 object-cover" />
                            <h2 className="text-lg font-semibold text-center">{d.name}</h2>
                            <p className="text-sm text-gray-600">{d.department}</p>
                        </div>
                    ))}
                    <div className="text-4xl w-full aspect-square flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer select-none" onClick={() => {
                        // alert("新增醫生功能尚未開放，敬請期待！")
                        setNewDoctor(true);
                        setSelectedDoctor("");
                    }}>
                        +
                    </div>
                </nav>

                <div className="w-full min-h-60 py-20">

                    {newDoctor ? (
                        <NewDoctor setReload={setReload} />
                    ) : (
                        <React.Fragment>
                            <EditDoctorForm doctorId={selectedDoctor} reload={reload} setReload={setReload} />
                            {selectedDoctor && (
                                <React.Fragment>
                                    <EditPasswordForm doctorId={selectedDoctor} />
                                    <EditScheduleForm doctorId={selectedDoctor} reload={reload} setReload={setReload} />
                                    <EditPhoto doctorId={selectedDoctor} reload={reload} setReload={setReload} />
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </section>
        </div>
    );
}

const EditDoctorForm = ({
    doctorId,
    ...params
}: {
    doctorId: string
    reload: number
    setReload: (value: number) => void
}) => {
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [bio, setBio] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");

    const sendData = async () => {
        const res = await fetch(`/api/admin/doctor/${doctorId}`, {
            method: 'PUT',
            body: JSON.stringify({
                bio,
                department,
                name,
                image: imageURL,
            })
        })
        const data = await res.json();
        if (!res.ok) {
            const issue = data.issues ? data.issues[0].message : '未知錯誤';
            Swal.fire({
                icon: 'error',
                title: '更新失敗',
                text: issue || '請稍後再試',
            });
            throw new Error('Failed to update doctor');
        }
        Swal.fire({
            icon: 'success',
            title: '更新成功',
            text: '醫生簡介已成功更新',
        });
        console.log("Updated doctor data:", data);
    }

    useEffect(() => {
        if (doctorId) {
            const fetchDoctor = async () => {
                setLoading(true);
                const res = await fetch(`/api/admin/doctor/${doctorId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch doctor');
                }
                const data = await res.json();
                setDoctor(data);
                console.log(data)

                setBio(data.doctor.bio || "");
                setName(data.name || "");
                setDepartment(data.doctor.department?.name || "");
                setImageURL(data.image || "");

                setLoading(false);
            };

            fetchDoctor();
        } else {
            setDoctor(null);
        }
    }, [doctorId, params.reload]);

    return (
        <div className="p-4 bg-white shadow-md rounded-md w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">醫生簡介</h2>

            {doctorId ? (
                <React.Fragment>
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <LoadingCircle color="BLUE" scale="MD" />
                        </div>
                    ) : (
                        <form className="flex flex-col space-y-4" onSubmit={(event) => {
                            event.preventDefault();
                            sendData()
                        }}>
                            {/* 新增這一段：只讀 email */}
                            <div className="flex flex-row gap-3 items-center">
                                <label className="block text-sm font-medium text-gray-700 w-12">Email</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                    value={doctor?.email || ""}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-row gap-3 items-center">
                                <label className="block text-sm font-medium text-gray-700 w-12">姓名</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    value={name || ""}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-row gap-3 items-center">
                                <label className="block text-sm font-medium text-gray-700 w-12">部門</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    value={department || ""}
                                    onChange={(e) => setDepartment(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-row gap-3 items-center">
                                <label className="block text-sm font-medium text-gray-700 w-12">個人經歷</label>
                                <TextareaAutosize
                                    placeholder="請輸入醫生的個人經歷或簡介"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    rows={4}
                                    value={bio || ""}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                                onClick={() => {
                                    console.log("Submitting data for doctor ID:", doctorId);
                                }}
                            >
                                更新醫生簡介
                            </button>
                        </form>
                    )}
                </React.Fragment>
            ) : (
                <p className="text-gray-500 text-center">請選擇一位醫生以編輯其簡介</p>
            )}
        </div>
    )
}

const EditScheduleForm = ({
    doctorId,
    ...props
}: {
    doctorId: string
    reload: number
    // setReload: (value: number) => void
    setReload: Dispatch<SetStateAction<number>>
}) => {
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState<number[]>(Array(21).fill(0));

    const fetchSchedule = async () => {
        setLoading(true);
        const res = await fetch(`/api/admin/doctor/schedule/${doctorId}`);
        if (!res.ok) {
            throw new Error('Failed to fetch schedule');
        }
        const data = await res.json();

        console.log(data);

        if (data !== null && data) {
            setSchedule(data);
        } else {
            // maping schedule to default values 0
            const empty_schedule = Array(21).fill(0);
            console.log("No schedule found, using default values");
            setSchedule(empty_schedule);
        }

        setLoading(false);
    };

    const updateSchedule = async () => {
        const res = await fetch(`/api/admin/doctor/schedule/${doctorId}`, {
            method: 'PUT',
            body: JSON.stringify({
                schedule
            })
        });

        if (!res.ok) {
            const data = await res.json();
            const issue = data.issues ? data.issues[0].message : '未知錯誤';
            Swal.fire({
                icon: 'error',
                title: '更新失敗',
                text: issue || '請稍後再試',
            });
            throw new Error('Failed to update schedule');
        }
        Swal.fire({
            icon: 'success',
            title: '排班已更新',
            text: '醫生的排班已成功更新',
        });

    }

    useEffect(() => {
        if (doctorId) {
            fetchSchedule();
        }
    }, [doctorId]);

    return (
        <div>
            {doctorId && (
                <div className="p-4 bg-white shadow-md rounded-md w-full max-w-md mx-auto">
                    <h2 className="text-lg font-semibold mb-4">編輯醫生排班</h2>

                    <div className="flex flex-col space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <LoadingCircle color="BLUE" scale="SM" />
                            </div>
                        ) : (
                            <React.Fragment>
                                <div className="grid grid-cols-8 ">
                                    {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => {
                                        if (d === 0) {
                                            return (
                                                <div key={Math.random()} className="flex flex-col items-center p-2 border border-gray-300 rounded-md select-none">
                                                    <span className="text-sm text-black" />
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={Math.random()} className="flex flex-col items-center p-2 border border-gray-300 rounded-md select-none">
                                                <span className="text-sm text-black">{`${numberInLetter(d - 1)}`}</span>
                                            </div>
                                        )
                                    })}
                                    {schedule.map((_, index) => {
                                        if (index === 0 || index === 7 || index === 14) {
                                            return (
                                                <React.Fragment key={index}>
                                                    <div className="flex flex-col items-center p-2 border border-gray-300 rounded-md select-none">
                                                        {index === 0 ? (
                                                            <span className="text-sm text-black">上午</span>
                                                        ) : index === 7 ? (
                                                            <span className="text-sm text-black">下午</span>
                                                        ) : index === 14 ? (
                                                            <span className="text-sm text-black">晚上</span>
                                                        ) : null}
                                                    </div>

                                                    <div className={clsx("flex flex-col items-center p-2 border border-gray-300 rounded-md cursor-pointer",
                                                        schedule[index] ? "bg-slate-600" : "bg-slate-100")}
                                                        onClick={() => {
                                                            const newSchedule = [...schedule];
                                                            newSchedule[index] = newSchedule[index] ? 0 : 1;
                                                            setSchedule(newSchedule);
                                                        }}
                                                    />
                                                </React.Fragment>
                                            )
                                        }
                                        return (
                                            <div key={index} className={clsx("flex flex-col items-center p-2 border border-gray-300 rounded-md cursor-pointer",
                                                schedule[index] ? "bg-slate-600" : "bg-slate-100")} onClick={() => {
                                                    const newSchedule = [...schedule];
                                                    newSchedule[index] = newSchedule[index] ? 0 : 1;
                                                    setSchedule(newSchedule);
                                                }} />
                                        )
                                    })}
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                    <button
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer mt-4"
                        onClick={() => {
                            console.log("Updating schedule for doctor ID:", doctorId);
                            updateSchedule();
                        }}
                    >
                        更新排班
                    </button>
                </div>
            )
            }
        </div >
    )
}

const EditPhoto = ({
    doctorId,
    ...props
}: {
    doctorId: string
    reload: number
    // setReload: (value: number) => void
    setReload: Dispatch<SetStateAction<number>>
}) => {
    const [imageBlob, setImageBlob] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    if (!doctorId) {
        return <></>
    }

    const pathname = usePathname();

    useEffect(() => {
        // Reset imageBlob when doctorId changes
        setImageBlob(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = ""; // Clear the file input
        }
    }, [doctorId, pathname]);

    const attachImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        
        if (!files || !files[0]) return;

        const imageBlob = URL.createObjectURL(files[0]);

        setImageBlob(imageBlob);

        // start upload the image to the server
        const p = await uploadImageToSupabase(files[0]);

        console.log(p)

        const res = await fetch(`/api/admin/doctor/image`, {
            method: "POST",
            body: JSON.stringify({
                doctorId,
                imageURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${p.url}`,
            })
        })

        if (!res.ok) {
            Swal.fire({
                icon: 'error',
                title: '上傳失敗',
                text: '請稍後再試',
            });
            throw new Error('Failed to upload image');
        }
        Swal.fire({
            icon: 'success',
            title: '上傳成功',
            text: '醫生照片已成功上傳',
        });

        props.setReload(r => r + 1);
    }

    return (
        <div className="p-4 bg-white shadow-md rounded-md w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">編輯醫生照片</h2>
            <p className="text-sm text-gray-500 mb-4">您可以在這裡上傳醫生的照片，並在更新後顯示在醫生簡介中。</p>

            {/* 一個上傳相片的按鈕 */}
            <input
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                type="file"
                name="doctor_photo"
                accept=".jpg,.jpeg,.png"
                onChange={(event) => {
                    attachImages(event);
                }}
                ref={imageInputRef}
            />
            {/* 預覽 */}
            {imageBlob && (
                <div className="mt-4">
                    <img src={imageBlob}
                        alt="預覽照片"
                        className="w-full h-40 object-cover rounded-md" />
                </div>
            )}
            {/* 預覽照片 */}
        </div>
    )
}

const NewDoctor = ({
    setReload
}: {
    setReload: Dispatch<SetStateAction<number>>
}) => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const createdoctor = async () => {
        const res = await fetch('/api/admin/doctor/create', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password
            })
        });
        const data = await res.json();
        if (!res.ok) {
            const issue = data.issues ? data.issues[0].message : '未知錯誤';
            Swal.fire({
                icon: 'error',
                title: '新增醫生失敗',
                text: issue || '請稍後再試',
            });
            throw new Error('Failed to create doctor');
        }
        Swal.fire({
            icon: 'success',
            title: '新增醫生成功',
            text: '醫生已成功新增，請在醫生列表中查看。',
        });
        console.log("Created doctor data:", data);

        setReload(r => r + 1); // 更新醫生列表

        setName("");
        setEmail("");
        setPassword("");
    }

    return (
        <div className="p-4 bg-white shadow-md rounded-md w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">新增醫生</h2>
            <p className="text-sm text-gray-500 mb-4">您可以在這裡新增醫生的基本資料，並在更新後顯示在醫生列表中。</p>
            {/* 新增醫生的表單 */}
            <form className="flex flex-col space-y-4" onSubmit={(event) => {
                event.preventDefault();
                createdoctor();
            }}>
                <div className="flex flex-row gap-3 items-center">
                    <label className="block text-sm font-medium text-gray-700 w-12">姓名</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="請輸入醫生姓名"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="flex flex-row gap-3 items-center">
                    <label className="block text-sm font-medium text-gray-700 w-12">電子郵件</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="請輸入電子郵件"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="flex flex-row gap-3 items-center">
                    <label className="block text-sm font-medium text-gray-700 w-12">密碼</label>
                    <input
                        placeholder="請輸入密碼"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        // type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    新增醫生
                </button>
            </form>
        </div>
    )
}
const EditPasswordForm = ({
    doctorId
}: {
    doctorId: string
}) => {
    const [password, setPassword] = useState<string>("");

    const updatePassword = async () => {
        const res = await fetch(`/api/admin/doctor/password/${doctorId}`, {
            method: 'PUT',
            body: JSON.stringify({
                password
            })
        });
        if (!res.ok) {
            const data = await res.json();
            const issue = data.issues ? data.issues[0].message : '未知錯誤';
            Swal.fire({
                icon: 'error',
                title: '更新失敗',
                text: issue || '請稍後再試',
            });
            throw new Error('Failed to update password');
        }
        Swal.fire({
            icon: 'success',
            title: '密碼已更新',
            text: '醫生的密碼已成功更新',
        });
    }

    return (
        <div className="p-4 bg-white shadow-md rounded-md w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">編輯醫生密碼</h2>
            <p className="text-sm text-gray-500 mb-4">您可以在這裡編輯醫生的密碼。</p>
            <form className="flex flex-col space-y-4" onSubmit={(event) => {
                event.preventDefault();
                updatePassword();
            }}>
                <div className="flex flex-row gap-3 items-center">
                    <label className="block text-sm font-medium text-gray-700 w-14">新密碼</label>
                    <input
                        type="password"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="請輸入新密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    更新密碼
                </button>
            </form>
        </div>
    )
}